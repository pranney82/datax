interface YouTubeChannelResponse {
  items: Array<{
    id: string;
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }>;
}

interface YouTubePlaylistResponse {
  items: Array<{
    contentDetails: {
      videoId: string;
    };
  }>;
  nextPageToken?: string;
}

interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

interface YouTubeApiResponse {
  items: YouTubeVideoDetails[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  author: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: string;
}

// Convert YouTube duration format (PT1H2M10S) to readable format (1:02:10)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const [, hours, minutes, seconds] = match;
  const parts = [];

  if (hours) {
    parts.push(hours);
    parts.push(minutes?.padStart(2, "0") || "00");
  } else if (minutes) {
    parts.push(minutes);
  } else {
    parts.push("0");
  }
  
  parts.push((seconds || "0").padStart(2, "0"));
  return parts.join(":");
}

// Format view count to readable format (1.2M, 500K, etc.)
function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return viewCount;
}

export async function getVideoDetails(videoIds: string[]): Promise<Video[]> {
  if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,contentDetails,statistics&` +
      `id=${videoIds.join(",")}&` +
      `key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data: YouTubeApiResponse = await response.json();

    return data.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      duration: formatDuration(item.contentDetails.duration),
      author: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/embed/${item.id}`,
      views: formatViewCount(item.statistics.viewCount),
    }));
  } catch (error) {
    console.error("Error fetching YouTube video details:", error);
    throw error;
  }
}

// Get channel's uploads playlist ID
async function getChannelUploadsPlaylistId(channelId: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?` +
    `part=contentDetails&` +
    `id=${channelId}&` +
    `key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.statusText}`);
  }

  const data: YouTubeChannelResponse = await response.json();
  if (!data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
    throw new Error("Could not find uploads playlist");
  }

  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

// Get all video IDs from a playlist
async function getPlaylistVideoIds(playlistId: string): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  const videoIds: string[] = [];
  let nextPageToken: string | undefined;

  do {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=contentDetails&` +
      `playlistId=${playlistId}&` +
      `maxResults=50&` +
      `pageToken=${nextPageToken || ''}&` +
      `key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data: YouTubePlaylistResponse = await response.json();
    videoIds.push(...data.items.map(item => item.contentDetails.videoId));
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return videoIds;
}

// Fetch all videos from a channel
export async function getChannelVideos(channelId: string): Promise<Video[]> {
  try {
    const uploadsPlaylistId = await getChannelUploadsPlaylistId(channelId);
    const videoIds = await getPlaylistVideoIds(uploadsPlaylistId);
    return await getVideoDetails(videoIds);
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    throw error;
  }
}

// Extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return url; // Return as-is if it's already an ID
}