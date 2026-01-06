import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FriendLinksData, LinkStatus } from '../src/types';
import axios from 'axios';

/**
 * Fetches friend link data from the provided URL
 * @param url The URL to fetch friend link data from
 * @returns Promise<FriendLinksData>
 */
async function fetchFriendLinks(url: string): Promise<FriendLinksData> {
  try {
    const response = await axios.get<FriendLinksData>(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'FriendLink Checker Bot 1.0'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch friend links from ${url}:`, error);
    throw new Error(`Failed to fetch friend links: ${error}`);
  }
}

/**
 * Checks the status of a single URL
 * @param url The URL to check
 * @param name
 * @returns Promise<LinkStatus>
 */
async function checkLinkStatus(url: string, name: string): Promise<LinkStatus> {
  const startTime = Date.now();
  try {
    const response = await axios.head(url, {
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
      headers: {
        'User-Agent': 'FriendLink Checker Bot 1.0'
      }
    });

    const responseTime = Date.now() - startTime;

    return {
      name,
      link: url,
      status: response.status,
      message: `Status ${response.status}`,
      lastChecked: new Date(),
      responseTime
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Handle different types of errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        name,
        link: url,
        status: 'timeout',
        message: 'Request timeout',
        lastChecked: new Date(),
        responseTime
      };
    } else if (error.response) {
      // Server responded with error status
      return {
        name,
        link: url,
        status: error.response.status,
        message: `Status ${error.response.status}`,
        lastChecked: new Date(),
        responseTime
      };
    } else {
      // Network error or other error
      return {
        name,
        link: url,
        status: 'error',
        message: error.message || 'Network error',
        lastChecked: new Date(),
        responseTime
      };
    }
  }
}

/**
 * Checks the status of all friend links
 * @param friendLinksData The friend links data to check
 * @returns Promise<LinkStatus[]>
 */
async function checkAllLinkStatuses(friendLinksData: FriendLinksData): Promise<LinkStatus[]> {
  // Only check links from categories that are not "special-links"
  const allLinks = friendLinksData.friends
    .filter(category => category.id_name !== "special-links") // Exclude special-links from checking
    .flatMap(category => 
      category.link_list.map(link => ({ name: link.name, link: link.link }))
    );
  
  // Process links with concurrency control to avoid overwhelming servers
  const results: LinkStatus[] = [];
  const concurrencyLimit = 5; // Process 5 links at a time
  const queue = [...allLinks];
  
  while (queue.length > 0) {
    const batch = queue.splice(0, concurrencyLimit);
    const batchPromises = batch.map(item => checkLinkStatus(item.link, item.name));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch the latest friend links data
    const friendLinksData = await fetchFriendLinks('https://santisify.top/links.json');
    
    // Check the status of all links (excluding special-links)
    const statuses = await checkAllLinkStatuses(friendLinksData);
    
    // Combine link statuses with original link data to include avatar and other details
    const result = {
      lastUpdate: new Date().toISOString(),
      totalLinks: statuses.length,
      statuses: statuses.map(status => {
        // Find the original link data in friendLinksData
        let originalLink = null;
        
        for (const category of friendLinksData.friends) {
          originalLink = category.link_list.find(link => link.link === status.link);
          if (originalLink) break;
        }
        
        // Return status with original link data if found
        if (originalLink) {
          return {
            ...originalLink, // Include original link data (name, link, avatar, intro)
            status: status.status, // Add status info
            message: status.message,
            lastChecked: status.lastChecked,
            responseTime: status.responseTime
          };
        } else {
          // If original link not found, return status as is
          return status;
        }
      })
    };
    
    return response.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}