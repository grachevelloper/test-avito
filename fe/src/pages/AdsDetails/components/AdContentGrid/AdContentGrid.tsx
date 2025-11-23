import {Grid, Card, VStack} from '@chakra-ui/react';

import {ImageGallery} from './components/ImageGallery';
import {ModerationHistory} from './components/ModerationHistory';
import {ProductCharacteristics} from './components/ProductCharacteristics';
import {SellerInfo} from './components/SellerInfo';

interface AdContentGridProps {
  images: string[];
  moderationHistory: Array<{
    action: string;
    moderatorName: string;
    comment?: string;
    timestamp: string;
  }>;
  category?: string;
  price?: number;
  status: string;
  priority?: string;
  createdAt: string;
  seller?: {
    name?: string;
    rating?: number;
    totalAds?: number;
    registeredAt?: string;
  };
}

export const AdContentGrid = (props: AdContentGridProps) => {
    return (
        <Grid templateColumns={{base: '1fr', lg: '2fr 1fr'}} gap={6}>
            <Card.Root>
                <Card.Body>
                    <VStack gap={6} align='stretch'>
                        <ImageGallery images={props.images} />
                        <ProductCharacteristics {...props} />
                    </VStack>
                </Card.Body>
            </Card.Root>

            <Card.Root>
                <Card.Body>
                    <VStack gap={6} align='stretch'>
                        <SellerInfo {...props.seller} />
                        <ModerationHistory history={props.moderationHistory} />
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Grid>
    );
};