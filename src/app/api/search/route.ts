import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'クエリパラメータが必要です' }, { status: 400 });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'YouTube API キーが設定されていません' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(query)}&` +
      `type=video&` +
      `videoDuration=short&` +
      `maxResults=20&` +
      `key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      return NextResponse.json({ error: 'YouTube API エラー' }, { status: response.status });
    }

    const data = await response.json();
    
    const videos = data.items?.map((item: { id: { videoId: string }, snippet: { title: string, thumbnails: { maxres?: { url: string }, high?: { url: string }, medium?: { url: string }, default?: { url: string } } } }) => {
      // 高品質なサムネイルを優先的に取得（maxres > high > medium > default）
      const thumbnails = item.snippet.thumbnails;
      const thumbnailUrl = thumbnails.maxres?.url || 
                          thumbnails.high?.url || 
                          thumbnails.medium?.url || 
                          thumbnails.default?.url;
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      };
    }) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('API request error:', error);
    return NextResponse.json({ error: 'API リクエストエラー' }, { status: 500 });
  }
}