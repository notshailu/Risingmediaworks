const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS to bypass local Windows DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed Works database if empty
    const Work = require('../models/Work');
    const count = await Work.countDocuments();
    if (count === 0) {
      console.log('Work collection is empty. Seeding default works...');
      const defaultWorks = [
        {
          title: 'AI Cinematic Universe',
          category: 'ai-videos',
          client: 'AI Studio',
          image: 'https://img.youtube.com/vi/wOg8_fZstWU/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=wOg8_fZstWU',
          description: 'Bespoke AI-generated cinematic visual production.'
        },
        {
          title: 'Generative Dreamscapes',
          category: 'ai-videos',
          client: 'AI Studio',
          image: 'https://img.youtube.com/vi/3gWRumPwpkA/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=3gWRumPwpkA',
          description: 'Exploring neural network narratives and synthetic cameras.'
        },
        {
          title: 'Future Realities',
          category: 'ai-videos',
          client: 'AI Studio',
          image: 'https://img.youtube.com/vi/yjsgsECCquo/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=yjsgsECCquo&t=15s',
          description: 'Dynamic neural synthesis and artificial motion art.'
        },
        {
          title: 'AI Visual Archive',
          category: 'ai-videos',
          client: 'AI Studio',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
          videoUrl: 'https://drive.google.com/drive/folders/1hXo6Q0CBYdN552nvyt3LcBPNE76vM0jV?usp=drive_link',
          description: 'Complete drive library of AI motion captures and concept videos.'
        },
        {
          title: 'Rising Motion Graphics Reel',
          category: 'motion-graphics',
          client: 'Rising Media',
          image: 'https://img.youtube.com/vi/8zBhYNs6usc/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=8zBhYNs6usc',
          description: 'Showcase of 2D/3D kinetic typography and particle systems.'
        },
        {
          title: 'Dynamic Kinetic Systems',
          category: 'motion-graphics',
          client: 'Rising Media',
          image: 'https://img.youtube.com/vi/3V9bYUBpF70/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=3V9bYUBpF70&t=52s',
          description: 'Corporate animation and commercial graphic packages.'
        },
        {
          title: 'Abstract UI Animations',
          category: 'motion-graphics',
          client: 'Rising Media',
          image: 'https://img.youtube.com/vi/up0KW3NpeWE/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=up0KW3NpeWE',
          description: 'Sleek app interfaces and dashboard motion layouts.'
        },
        {
          title: 'Flow & Geometry',
          category: 'motion-graphics',
          client: 'Rising Media',
          image: 'https://img.youtube.com/vi/xu2_ZYntgtw/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=xu2_ZYntgtw&t=20s',
          description: 'High-fidelity geometric simulations.'
        },
        {
          title: 'Greaves Cotton Corporate Film',
          category: 'greaves',
          client: 'Greaves Cotton',
          image: 'https://img.youtube.com/vi/w_xOxPuBmjk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=w_xOxPuBmjk&t=2s',
          description: 'Cinematic corporate brand identity and manufacturing story for Greaves.'
        },
        {
          title: 'Greaves Mobility Showcase',
          category: 'greaves',
          client: 'Greaves Cotton',
          image: 'https://img.youtube.com/vi/nc7Dn7nzjHk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=nc7Dn7nzjHk&t=73s',
          description: 'Highlighting future-ready clean energy transport solutions.'
        },
        {
          title: 'ITOTY Campaigns Library',
          category: 'itoty',
          client: 'ITOTY',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
          videoUrl: 'https://drive.google.com/drive/folders/1uSuXQDHeL9m7l2IOTYkNCevRRngIhyE2',
          description: 'Collection of premium visual designs and commercial edits.'
        },
        {
          title: 'NH Corporate Documentary',
          category: 'nh-work',
          client: 'NH Group',
          image: 'https://img.youtube.com/vi/A1pwtdmXWtk/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=A1pwtdmXWtk',
          description: 'In-depth storytelling of corporate infrastructure development.'
        },
        {
          title: 'NH Architectural Vision',
          category: 'nh-work',
          client: 'NH Group',
          image: 'https://img.youtube.com/vi/SGcGnys014E/hqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=SGcGnys014E',
          description: 'Showcasing blueprints and clean digital layouts.'
        }
      ];
      await Work.insertMany(defaultWorks);
      console.log('Seeded database successfully with default works!');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
