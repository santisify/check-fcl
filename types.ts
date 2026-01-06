export interface FriendLink {
  name: string;
  link: string;
  avatar?: string;
  intro?: string;
}

export interface FriendLinkCategory {
  id_name: string;
  desc: string;
  link_list: FriendLink[];
}

export interface FriendLinksData {
  friends: FriendLinkCategory[];
}

export interface LinkStatus {
  name: string;
  link: string;
  status: number | 'timeout' | 'error';
  message: string;
  lastChecked: Date;
  responseTime?: number;
}