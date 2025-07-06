"use client";

import { useState } from "react";
import { Box, Button, Input, VStack, HStack, Text, Container, SimpleGrid, Card, CardBody, Alert, AlertIcon } from "@yamada-ui/react";

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const searchVideos = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setVideos(data.videos);
      }
    } catch {
      setError("検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack gap={8}>
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb={2}>
            YouTube Short Playlists
          </Text>
          <Text color="gray.600">
            キーワードでYouTube Shortを検索してプレイリストを作成
          </Text>
        </Box>

        <Box w="full" maxW="500px">
          <HStack>
            <Input
              placeholder="キーワードを入力..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchVideos()}
            />
            <Button onClick={searchVideos} loading={loading}>
              検索
            </Button>
          </HStack>
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {videos.length > 0 && (
          <VStack gap={6} w="full">
            <Box w="full" maxW="600px">
              <Card>
                <CardBody>
                  <VStack gap={4}>
                    <Box w="full" h="400px" position="relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videos[currentVideoIndex]?.id}`}
                        title={videos[currentVideoIndex]?.title}
                        style={{ border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {videos[currentVideoIndex]?.title}
                    </Text>
                    <HStack gap={4}>
                      <Button onClick={prevVideo} disabled={videos.length <= 1}>
                        前へ
                      </Button>
                      <Text>
                        {currentVideoIndex + 1} / {videos.length}
                      </Text>
                      <Button onClick={nextVideo} disabled={videos.length <= 1}>
                        次へ
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            <Box w="full">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                プレイリスト
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                {videos.map((video, index) => (
                  <Card
                    key={video.id}
                    cursor="pointer"
                    onClick={() => setCurrentVideoIndex(index)}
                    bg={index === currentVideoIndex ? "blue.50" : "white"}
                    borderColor={index === currentVideoIndex ? "blue.500" : "gray.200"}
                    _hover={{ bg: "gray.50" }}
                  >
                    <CardBody>
                      <VStack gap={2}>
                        <Box w="full" h="120px" position="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                        <Text fontSize="sm" fontWeight="medium" textAlign="center" isTruncated>
                          {video.title}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
