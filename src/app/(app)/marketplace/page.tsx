import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    id: 'prod-001',
    name: 'Home Compost Kit',
    price: '$49.99',
    description: 'Start composting kitchen scraps with this easy-to-use beginner kit.',
    imageId: 'marketplace-compost-kit',
  },
  {
    id: 'prod-002',
    name: 'Segregation Dustbins (Set of 3)',
    price: '$29.99',
    description: 'Color-coded bins for separating dry, wet, and hazardous waste.',
    imageId: 'marketplace-dustbins',
  },
  {
    id: 'prod-003',
    name: 'Eco-Friendly Gardening Tools',
    price: '$39.99',
    description: 'Durable tools made from recycled materials for your green space.',
    imageId: 'marketplace-gardening-tools',
  },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Waste Utility Shop"
        description="Purchase utilities to help you manage waste more effectively."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = PlaceHolderImages.find((img) => img.id === product.imageId);
          return (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="p-0">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={400}
                    height={300}
                    className="w-full rounded-t-lg object-cover"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="mt-2">{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-6 pt-0">
                <p className="text-2xl font-bold text-primary">{product.price}</p>
                <Button variant="outline">
                    <ShoppingCart className='mr-2' />
                    Add to Cart
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
