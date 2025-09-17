import { PageHeader } from '@/components/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const trainingModules = [
  {
    title: 'Module 1: Introduction to Waste Management',
    content: 'This module covers the basics of waste management, its importance, and the impact of improper disposal on the environment and public health. We will explore the "3 Rs": Reduce, Reuse, and Recycle.',
  },
  {
    title: 'Module 2: Waste Segregation at Source',
    content: 'Learn how to correctly segregate waste into different categories: wet, dry, and hazardous. This is the most critical step for effective recycling and resource recovery. We provide examples for each category.',
  },
  {
    title: 'Module 3: Home Composting Techniques',
    content: 'Turn your kitchen scraps into valuable compost for your garden. This module provides a step-by-step guide to setting up and maintaining a home compost bin, troubleshooting common issues, and using the finished compost.',
  },
  {
    title: 'Module 4: Understanding Recycling',
    content: 'Not all plastics are the same. This module delves into the different types of recyclable materials, how to prepare them for collection, and what happens to them after they are collected.',
  },
    {
    title: 'Module 5: Role of a Green Champion',
    content: 'As a Green Champion, you are a leader in our community. This module outlines your responsibilities, how to report issues effectively using the app, and how to organize and motivate your neighbors to participate in community initiatives.',
  },
];

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Waste Management Training"
        description="Complete these mandatory modules to become a certified Green Champion."
      />

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {trainingModules.map((module, index) => (
              <AccordionItem value={`item-${index + 1}`} key={module.title}>
                <AccordionTrigger className='text-lg font-semibold hover:no-underline'>{module.title}</AccordionTrigger>
                <AccordionContent className='text-base text-muted-foreground'>
                  {module.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
