import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { 
  Container, 
  Grid, 
  GridItem, 
  Flex, 
  Stack, 
  HStack, 
  Responsive 
} from '../components/ui/responsive-layout';

const meta: Meta<typeof Container> = {
  title: 'Layout/ResponsiveLayout',
  component: Container,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

// Container component
export const ContainerExample: StoryObj<typeof Container> = {
  render: () => (
    <div className="space-y-4">
      <Container maxWidth="sm" className="bg-primary/10 p-4 rounded-lg">
        <p className="text-center">Small Container (max-w-screen-sm)</p>
      </Container>
      
      <Container maxWidth="md" className="bg-primary/10 p-4 rounded-lg">
        <p className="text-center">Medium Container (max-w-screen-md)</p>
      </Container>
      
      <Container maxWidth="lg" className="bg-primary/10 p-4 rounded-lg">
        <p className="text-center">Large Container (max-w-screen-lg)</p>
      </Container>
      
      <Container maxWidth="xl" className="bg-primary/10 p-4 rounded-lg">
        <p className="text-center">Extra Large Container (max-w-screen-xl)</p>
      </Container>
      
      <Container maxWidth="2xl" className="bg-primary/10 p-4 rounded-lg">
        <p className="text-center">2XL Container (max-w-screen-2xl)</p>
      </Container>
    </div>
  ),
};

// Grid component
export const GridExample: StoryObj<typeof Grid> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Grid</h3>
        <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-primary/10 p-4 rounded-lg text-center">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Grid with Different Gap Sizes</h3>
        <Grid columns={{ xs: 2, md: 4 }} gap="lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-accent/10 p-4 rounded-lg text-center">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Grid with Column and Row Gaps</h3>
        <Grid columns={{ xs: 2, md: 4 }} rowGap="lg" columnGap="sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-accent/10 p-4 rounded-lg text-center">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  ),
};

// GridItem component
export const GridItemExample: StoryObj<typeof GridItem> = {
  render: () => (
    <div>
      <h3 className="text-lg font-medium mb-2">Grid with Spanning Items</h3>
      <Grid columns={{ xs: 4, md: 12 }} gap="md">
        <GridItem colSpan={{ xs: 4, md: 6 }} className="bg-primary/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 6 on tablet+</p>
        </GridItem>
        <GridItem colSpan={{ xs: 4, md: 6 }} className="bg-primary/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 6 on tablet+</p>
        </GridItem>
        <GridItem colSpan={{ xs: 4, md: 4 }} className="bg-accent/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 4 on tablet+</p>
        </GridItem>
        <GridItem colSpan={{ xs: 4, md: 4 }} className="bg-accent/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 4 on tablet+</p>
        </GridItem>
        <GridItem colSpan={{ xs: 4, md: 4 }} className="bg-accent/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 4 on tablet+</p>
        </GridItem>
        <GridItem colSpan={{ xs: 4, md: 12 }} className="bg-primary/10 p-4 rounded-lg">
          <p>Spans 4 columns on mobile, 12 (full width) on tablet+</p>
        </GridItem>
      </Grid>
    </div>
  ),
};

// Flex component
export const FlexExample: StoryObj<typeof Flex> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Flex (Row)</h3>
        <Flex gap="md" className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Flex Column</h3>
        <Flex direction="column" gap="md" className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Responsive Flex (Column on Mobile, Row on Desktop)</h3>
        <Flex 
          direction="column" 
          responsive={{
            md: { direction: 'row' }
          }}
          gap="md" 
          className="bg-muted/30 p-4 rounded-lg"
        >
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Flex with Different Alignment</h3>
        <Flex 
          justify="between" 
          align="center" 
          className="bg-muted/30 p-4 rounded-lg h-32"
        >
          <div className="bg-primary/10 p-4 rounded-lg">Start</div>
          <div className="bg-primary/10 p-4 rounded-lg">Center</div>
          <div className="bg-primary/10 p-4 rounded-lg">End</div>
        </Flex>
      </div>
    </div>
  ),
};

// Stack component
export const StackExample: StoryObj<typeof Stack> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Stack</h3>
        <Stack spacing="md" className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Stack with Dividers</h3>
        <Stack spacing="md" dividers className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </Stack>
      </div>
    </div>
  ),
};

// HStack component
export const HStackExample: StoryObj<typeof HStack> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Basic HStack</h3>
        <HStack spacing="md" className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </HStack>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">HStack with Dividers</h3>
        <HStack spacing="md" dividers className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </HStack>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">HStack with Different Spacing</h3>
        <HStack spacing="lg" className="bg-muted/30 p-4 rounded-lg">
          <div className="bg-primary/10 p-4 rounded-lg">Item 1</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 2</div>
          <div className="bg-primary/10 p-4 rounded-lg">Item 3</div>
        </HStack>
      </div>
    </div>
  ),
};

// Responsive component
export const ResponsiveExample: StoryObj<typeof Responsive> = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Responsive Visibility</h3>
        <div className="bg-muted/30 p-4 rounded-lg">
          <Responsive hide={['md', 'lg']}>
            <div className="bg-primary/10 p-4 rounded-lg">
              Visible on mobile and extra large screens, hidden on medium and large screens
            </div>
          </Responsive>
          
          <Responsive show={['md', 'lg']}>
            <div className="bg-accent/10 p-4 rounded-lg mt-4">
              Hidden on mobile and extra large screens, visible on medium and large screens
            </div>
          </Responsive>
        </div>
      </div>
    </div>
  ),
};