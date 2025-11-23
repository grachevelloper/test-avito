import {Box, Grid, Text, Heading, Image, Card} from '@chakra-ui/react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({images}: ImageGalleryProps) => (
    <Card.Root>
        <Card.Body>
            <Heading size='md' mb={4}>
                Галерея изображений
            </Heading>
            <Grid
                templateColumns={{base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}
                gap={4}
            >
                {images.slice(0, 3).map((image, index) => (
                    <Box
                        key={index}
                        backgroundColor='gray.50'
                        border='1px dashed'
                        borderColor='gray.200'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        borderRadius='md'
                        aspectRatio='1/1'
                        position='relative'
                        overflow='hidden'
                    >
                        {image ? (
                            <Image
                                src={image}
                                alt={`Изображение ${index + 1}`}
                                width='100%'
                                height='100%'
                                objectFit='cover'
                            />
                        ) : (
                            <Text color='gray.400' fontSize='sm' textAlign='center'>
                                Нет изображения
                            </Text>
                        )}
                    </Box>
                ))}
            </Grid>
            {images.length > 3 && (
                <Text color='primary' fontSize='sm' mt={3}>
                    +{images.length - 3} изображений
                </Text>
            )}
        </Card.Body>
    </Card.Root>
);