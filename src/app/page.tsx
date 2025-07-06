"use client";

import { useState } from "react";
import { Box, Button, Input, VStack, Text, Container, SimpleGrid, Card, CardBody, Alert, AlertIcon, Heading, Flex, Badge } from "@yamada-ui/react";

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
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }} py={4}>
        <VStack gap={6}>
          <Box textAlign="center" py={4}>
            <Heading
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="700"
              mb={3}
              color="gray.800"
              letterSpacing="tight"
            >
              YouTube Short Playlists
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              キーワードでYouTube Shortを検索してプレイリストを作成
            </Text>
          </Box>

          <Box w="full" maxW="500px">
            <Flex
              bg="white"
              borderRadius="2xl"
              p={1.5}
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
              gap={2}
            >
              <Input
                placeholder="キーワードを入力..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchVideos()}
                border="none"
                outline="none"
                _focus={{ boxShadow: "none" }}
                fontSize="md"
                pl={4}
                color="gray.700"
              />
              <Button
                onClick={searchVideos}
                loading={loading}
                bg="gray.800"
                color="white"
                _hover={{ bg: "gray.700" }}
                _active={{ bg: "gray.900" }}
                borderRadius="xl"
                px={6}
                fontSize="sm"
                fontWeight="600"
              >
                検索
              </Button>
            </Flex>
          </Box>

          {error && (
            <Alert status="error" borderRadius="lg" boxShadow="lg">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {videos.length > 0 && (
            <VStack gap={6} w="full">
              <Box w="full" maxW={{ base: "100%", md: "700px", lg: "800px" }}>
                <Card
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  overflow="hidden"
                >
                  <CardBody p={{ base: 4, md: 6 }}>
                    <VStack gap={4}>
                      <Box 
                        w="full" 
                        h={{ base: "250px", md: "350px", lg: "400px" }} 
                        position="relative" 
                        borderRadius="xl" 
                        overflow="hidden"
                      >
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
                      <Text 
                        fontSize={{ base: "md", md: "lg" }} 
                        fontWeight="600" 
                        textAlign="center" 
                        color="gray.800"
                        px={2}
                      >
                        {videos[currentVideoIndex]?.title}
                      </Text>
                      <Flex alignItems="center" gap={4}>
                        <Button
                          onClick={prevVideo}
                          disabled={videos.length <= 1}
                          variant="outline"
                          borderColor="gray.300"
                          color="gray.700"
                          _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                          borderRadius="lg"
                          size="sm"
                        >
                          前へ
                        </Button>
                        <Badge
                          bg="gray.100"
                          color="gray.700"
                          fontSize="sm"
                          py={1}
                          px={3}
                          borderRadius="lg"
                          fontWeight="500"
                        >
                          {currentVideoIndex + 1} / {videos.length}
                        </Badge>
                        <Button
                          onClick={nextVideo}
                          disabled={videos.length <= 1}
                          variant="outline"
                          borderColor="gray.300"
                          color="gray.700"
                          _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                          borderRadius="lg"
                          size="sm"
                        >
                          次へ
                        </Button>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>

              <Box w="full">
                <Heading
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  mb={4}
                  color="gray.800"
                  textAlign="center"
                >
                  プレイリスト
                </Heading>
                <SimpleGrid 
                  columns={{ 
                    base: 2, 
                    sm: 3, 
                    md: 4, 
                    lg: 5, 
                    xl: 6, 
                    "2xl": 7 
                  }} 
                  gap={{ base: 3, md: 4 }}
                  w="full"
                >
                  {videos.map((video, index) => (
                    <Card
                      key={video.id}
                      cursor="pointer"
                      onClick={() => setCurrentVideoIndex(index)}
                      bg={index === currentVideoIndex ? "gray.100" : "white"}
                      borderColor={index === currentVideoIndex ? "gray.400" : "gray.200"}
                      borderWidth="1px"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                        borderColor: "gray.300"
                      }}
                      transition="all 0.2s"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                    >
                      <CardBody p={0}>
                        <VStack gap={0}>
                          <Box w="full" position="relative" aspectRatio="16/9">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block"
                              }}
                            />
                            {index === currentVideoIndex && (
                              <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                bg="gray.800"
                                borderRadius="full"
                                p={1.5}
                                boxShadow="md"
                              >
                                <Text color="white" fontSize="xs">
                                  ▶
                                </Text>
                              </Box>
                            )}
                          </Box>
                          <Box p={2} w="full">
                            <Text
                              fontSize="xs"
                              fontWeight="500"
                              textAlign="center"
                              color="gray.700"
                              lineHeight="1.2"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              display="-webkit-box"
                              style={{
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical"
                              }}
                            >
                              {video.title}
                            </Text>
                          </Box>
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
    </Box>
  );
}
