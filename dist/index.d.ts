import { FriendLinksData, LinkStatus } from './types';
declare let currentLinkStatuses: LinkStatus[];
declare let lastUpdate: Date;
/**
 * Fetches friend link data from the provided URL
 * @param url The URL to fetch friend link data from
 * @returns Promise<FriendLinksData>
 */
export declare function fetchFriendLinks(url: string): Promise<FriendLinksData>;
/**
 * Checks the status of a single URL
 * @param url The URL to check
 * @param name
 * @returns Promise<LinkStatus>
 */
export declare function checkLinkStatus(url: string, name: string): Promise<LinkStatus>;
/**
 * Checks the status of all friend links
 * @param friendLinksData The friend links data to check
 * @returns Promise<LinkStatus[]>
 */
export declare function checkAllLinkStatuses(friendLinksData: FriendLinksData): Promise<LinkStatus[]>;
export declare function startServer(): void;
export declare function runDailyCheck(): Promise<void>;
export { currentLinkStatuses, lastUpdate };
//# sourceMappingURL=index.d.ts.map