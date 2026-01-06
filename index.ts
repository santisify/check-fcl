import axios from 'axios';
import express, {Request, Response} from 'express';
import cors from 'cors';
import cron from 'node-cron';
import * as fs from 'fs';
import {FriendLinksData, LinkStatus} from './types';

// Global variable to store the latest link statuses
let currentLinkStatuses: LinkStatus[] = [];
let lastUpdate: Date = new Date(0); // Initialize to epoch time
let currentFriendLinksData: FriendLinksData | null = null; // Store the original friend links data

/**
 * Fetches friend link data from the provided URL
 * @param url The URL to fetch friend link data from
 * @returns Promise<FriendLinksData>
 */
// @ts-ignore
export async function fetchFriendLinks(url: string): Promise<FriendLinksData> {
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
// @ts-ignore
export async function checkLinkStatus(url: string, name: string): Promise<LinkStatus> {
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
export async function checkAllLinkStatuses(friendLinksData: FriendLinksData): Promise<LinkStatus[]> {
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

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Enable CORS for all routes
app.use(cors());

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to get current link statuses
app.get('/api/status', (req: Request, res: Response) => {
  // Combine link statuses with original link data to include avatar and other details
  const result = {
    lastUpdate,
    totalLinks: currentLinkStatuses.length,
    statuses: currentLinkStatuses.map(status => {
      // Find the original link data in currentFriendLinksData
      let originalLink = null;
      
      if (currentFriendLinksData) {
        for (const category of currentFriendLinksData.friends) {
          originalLink = category.link_list.find(link => link.link === status.link);
          if (originalLink) break;
        }
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
  
  res.json(result);
});

// Serve the main page
app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Function to start the web server
export function startServer() {
  let currentPort = PORT;
  const maxRetries = 10; // 最多重试10个端口
  let retries = 0;

  function attemptListen(port: number) {
    const server = app.listen(port, () => {
      console.log(`Friend link checker server running on port ${port}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        retries++;
        if (retries <= maxRetries) {
          const newPort = port + 1;
          console.log(`Port ${port} is busy, trying port ${newPort} (attempt ${retries}/${maxRetries})`);
          attemptListen(newPort);
        } else {
          console.error(`Could not find an available port after ${maxRetries} attempts. Please free up a port.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  }

  attemptListen(currentPort);
}

// Function to run the daily check
export async function runDailyCheck() {
  try {
    console.log(`Starting daily friend link check at ${new Date().toISOString()}`);
    
    // Fetch the latest friend links data
    const friendLinksData = await fetchFriendLinks('https://santisify.top/links.json');
    
    // Store the original friend links data for API use
    currentFriendLinksData = friendLinksData;
    
    // Check the status of all links (excluding special-links)
    const statuses = await checkAllLinkStatuses(friendLinksData);
    
    // Update the global variables
    currentLinkStatuses = statuses;
    lastUpdate = new Date();
    
    // Separate valid and invalid links from categories that were checked
    const validLinks = [];
    const invalidLinks = [];
    
    // Get original link data from categories that should be checked (not special-links)
    const linksToCheck = friendLinksData.friends
      .filter(category => category.id_name !== "special-links")
      .flatMap(category => 
        category.link_list.map(link => ({ ...link }))
      );
    
    // For each link that was checked, determine if it's valid or invalid
    for (const originalLink of linksToCheck) {
      const status = statuses.find(s => s.link === originalLink.link);
      
      // Consider status codes 200-299 as valid (2xx are good)
      // Also consider 3xx redirects as valid for friend links
      if (status && typeof status.status === 'number' && status.status >= 200 && status.status < 400) {
        validLinks.push(originalLink);
      } else {
        // Add status information to the invalid link object
        invalidLinks.push({
          ...originalLink,
          status: status ? status.status : 'error',
          message: status ? status.message : 'No status found'
        });
      }
    }
    
    // Create result object with the exact structure requested
    const resultData = {
      friends: [
        {
          id_name: "friends",
          desc: "Common links included in circle friends",
          link_list: validLinks
        },
        {
          id_name: "inactive-links",
          desc: "Inactive or rule-breaking friends",
          link_list: invalidLinks
        }
      ]
    };
    
    // Save the result to result.json in the current directory
    fs.writeFileSync('./result.json', JSON.stringify(resultData, null, 2));
    
    console.log(`Daily check completed. Checked ${statuses.length} links.`);
    console.log(`Valid links: ${validLinks.length}, Invalid links: ${invalidLinks.length}`);
    console.log('Results saved to result.json');
  } catch (error) {
    console.error('Error during daily check:', error);
  }
}

// Schedule the daily check at 00:00 (midnight)
// The cron expression "0 0 * * *" means:
// - 0 seconds
// - 0 minutes  
// - 0 hours (midnight)
// - Every day
// - Every month
// - Every day of the week
cron.schedule('0 0 * * *', async () => {
  await runDailyCheck();
}, {
  scheduled: true,
  timezone: "Asia/Shanghai" // Set to China Standard Time
});

// Initialize the check when the server starts
runDailyCheck().then(() => {
  startServer();
  
  // Also run the check every hour to keep data fresh
  cron.schedule('0 * * * *', async () => {
    await runDailyCheck();
  }, {
    scheduled: true,
    timezone: "Asia/Shanghai"
  });
});

// Export functions for use in other modules
export {currentLinkStatuses, lastUpdate};