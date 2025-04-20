
// Define the base set of default avatars
const BASE_AVATARS = [
  // Films & Cinéma
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=500&auto=format&fit=crop", // Popcorn
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop", // Cinéma
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop", // Bobine
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop", // Projecteur
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop", // Tickets
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop", // Film strip
  "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&auto=format&fit=crop", // Movie poster
  "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&auto=format&fit=crop", // Clapperboard
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop", // Director chair
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=500&auto=format&fit=crop", // Spotlight
  
  // Gaming
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop", // Controller
  "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&auto=format&fit=crop", // Console
  "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=500&auto=format&fit=crop", // Gaming setup
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop", // Neon gaming
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop", // Retro console
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop", // Gaming keyboard
  "https://images.unsplash.com/photo-1580327332925-a10e6cb11baa?w=500&auto=format&fit=crop", // Gaming mouse
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop", // Arcade
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop", // Gaming pattern
  "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&auto=format&fit=crop", // Gaming lights
  
  // Livres & Lecture
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&auto=format&fit=crop", // Stack of books
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop", // Library
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop", // Book pages
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop", // Reading
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop", // Bookshelf
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop", // Open book
  "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&auto=format&fit=crop", // Book cover
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop", // Book art
  "https://images.unsplash.com/photo-1553729784-e91953dec042?w=500&auto=format&fit=crop", // Vintage books
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop", // Reading corner

  // Séries TV
  "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop", // TV static
  "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop", // Remote control
  "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&auto=format&fit=crop", // TV screen
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop", // Netflix
  "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&auto=format&fit=crop", // TV setup
  "https://images.unsplash.com/photo-1611162616305-c69b3037c7bb?w=500&auto=format&fit=crop", // Streaming
  "https://images.unsplash.com/photo-1579935110464-fcd041be62d0?w=500&auto=format&fit=crop", // TV room
  "https://images.unsplash.com/photo-1515687652280-bf0bb698562a?w=500&auto=format&fit=crop", // Series watching
  "https://images.unsplash.com/photo-1586170321137-6ee3d6c44c93?w=500&auto=format&fit=crop", // Binge watching
  "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop", // TV aesthetic
  
  // Art & Culture
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop", // Art gallery
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&auto=format&fit=crop", // Museum
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&auto=format&fit=crop", // Art piece
  "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=500&auto=format&fit=crop", // Sculpture
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&auto=format&fit=crop", // Street art
  "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=500&auto=format&fit=crop", // Contemporary art
  "https://images.unsplash.com/photo-1577083552431-c4ab1e8fa0d2?w=500&auto=format&fit=crop", // Art installation
  "https://images.unsplash.com/photo-1575223970949-ac3047720656?w=500&auto=format&fit=crop", // Digital art
  "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=500&auto=format&fit=crop", // Art museum
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&auto=format&fit=crop", // Modern art

  // Icônes d'animation
  "https://images.unsplash.com/photo-1580477667929-3ef27c684b7a?w=500&auto=format&fit=crop", // Anime style
  "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&auto=format&fit=crop", // Manga
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop", // Animation
  "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=500&auto=format&fit=crop", // Comic style
  "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=500&auto=format&fit=crop", // Cartoon art

  // Cinéma abstrait
  "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=500&auto=format&fit=crop", // Film noir
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop", // Cinema lights
  "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?w=500&auto=format&fit=crop", // Movie scene
  "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500&auto=format&fit=crop", // Film aesthetic
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop", // Cinema art

  // Gaming abstrait
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop", // Neon gaming
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop", // Retro pixels
  "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500&auto=format&fit=crop", // Game lights
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&auto=format&fit=crop", // Gaming setup
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop", // Arcade neon

  // Livres abstraits
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop", // Library mood
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop", // Book magic
  "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=500&auto=format&fit=crop", // Reading light
  "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=500&auto=format&fit=crop", // Book art
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop", // Library abstract

  // TV & Streaming abstrait
  "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop", // TV static
  "https://images.unsplash.com/photo-1595231712607-a5f5665c8a44?w=500&auto=format&fit=crop", // Streaming art
  "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&auto=format&fit=crop", // TV vibes
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop", // Series mood
  "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&auto=format&fit=crop", // TV aesthetics

  // Culture Pop
  "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=500&auto=format&fit=crop", // Pop art
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop", // Music vibes
  "https://images.unsplash.com/photo-1561211919-1947abbbb35b?w=500&auto=format&fit=crop", // Pop culture
  "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=500&auto=format&fit=crop", // Entertainment
  "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=500&auto=format&fit=crop", // Media mix

  // Abstract Entertainment
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop", // Neon abstract
  "https://images.unsplash.com/photo-1603665301175-57ba46f392bf?w=500&auto=format&fit=crop", // Light art
  "https://images.unsplash.com/photo-1603665270146-bbdf9858ea55?w=500&auto=format&fit=crop", // Color play
  "https://images.unsplash.com/photo-1603665185348-6d7c36b34e95?w=500&auto=format&fit=crop", // Digital waves
  "https://images.unsplash.com/photo-1603665185348-6d7c36b34e95?w=500&auto=format&fit=crop", // Abstract patterns

  // Movie Icons
  "https://images.unsplash.com/photo-1542204637-e67bc7d41e48?w=500&auto=format&fit=crop", // Clapper
  "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=500&auto=format&fit=crop", // Reel
  "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&auto=format&fit=crop", // Camera
  "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&auto=format&fit=crop", // Director
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop", // Scene

  // Gaming Icons
  "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop", // Controller
  "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&auto=format&fit=crop", // Console
  "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=500&auto=format&fit=crop", // Gaming setup
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop", // Retro gaming
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop", // Gaming gear

  // Book Icons
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&auto=format&fit=crop", // Books
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop", // Library
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop", // Pages
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop", // Reading
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop", // Bookshelf

  // TV Icons
  "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop", // TV
  "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop", // Remote
  "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&auto=format&fit=crop", // Screen
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop", // Streaming
  "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&auto=format&fit=crop", // Setup

  // Additional Entertainment Icons
  "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=500&auto=format&fit=crop", // Entertainment
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&auto=format&fit=crop", // Media
  "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500&auto=format&fit=crop", // Culture
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop", // Digital
  "https://images.unsplash.com/photo-1616469828695-aa0c8c4384ac?w=500&auto=format&fit=crop", // Arts
  
  // Additional Film & Cinema Avatars
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=500&auto=format&fit=crop", // Film reel
  "https://images.unsplash.com/photo-1601643157091-5ddaad3c4339?w=500&auto=format&fit=crop", // Movie camera
  "https://images.unsplash.com/photo-1478720962843-6ebe3478d7f4?w=500&auto=format&fit=crop", // Movie theater
  "https://images.unsplash.com/photo-1515634928627-2a4e0462ecf0?w=500&auto=format&fit=crop", // Cinema seats
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop", // Projector
  
  // Gaming Avatars
  "https://images.unsplash.com/photo-1580327332925-a10e6cb11baa?w=500&auto=format&fit=crop", // Gaming mouse
  "https://images.unsplash.com/photo-1611078489935-0cb3706c4f4d?w=500&auto=format&fit=crop", // Gaming keyboard
  "https://images.unsplash.com/photo-1677720359467-a676b54f0d7b?w=500&auto=format&fit=crop", // Gaming headset
  "https://images.unsplash.com/photo-1580234815007-5cfbee4ed223?w=500&auto=format&fit=crop", // Retro console
  
  // Book & Reading Avatars
  "https://images.unsplash.com/photo-1532012197267-55f5294ba709?w=500&auto=format&fit=crop", // Bookshelf
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop", // Reading glasses
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop", // Coffee and book
  
  // TV & Series Avatars
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop", // Netflix logo
  "https://images.unsplash.com/photo-1601643157091-5ddaad3c4339?w=500&auto=format&fit=crop", // TV setup
  "https://images.unsplash.com/photo-1616363088594-3f997044f6cb?w=500&auto=format&fit=crop", // Streaming devices
  
  // Art & Culture Avatars
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&auto=format&fit=crop", // Art piece
  "https://images.unsplash.com/photo-1583209814005-04b3e7ca0ba4?w=500&auto=format&fit=crop", // Museum
  "https://images.unsplash.com/photo-1579541652484-eff9d52aa0e7?w=500&auto=format&fit=crop", // Street art
  
  // Animation & Anime Avatars
  "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?w=500&auto=format&fit=crop", // Comic style
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop", // Animation
  
  // Pop Culture & Entertainment
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop", // Music vibes
  "https://images.unsplash.com/photo-1603665185348-6d7c36b34e95?w=500&auto=format&fit=crop", // Digital art
];

// Helper function to get a random avatar from the collection
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[randomIndex];
};

// Automatically generate additional avatars by adding more diverse, high-quality images
// from Unsplash that match the app's entertainment and cultural themes
const generateAdditionalAvatars = () => {
  const additionalAvatars = [];
  const themeGroups = [
    { theme: 'Cinema', query: 'movie theater film cinema' },
    { theme: 'Gaming', query: 'video game console gaming' },
    { theme: 'Books', query: 'library reading book' },
    { theme: 'TV Series', query: 'television streaming series' },
    { theme: 'Art', query: 'art museum culture' },
    { theme: 'Pop Culture', query: 'entertainment music' }
  ];

  themeGroups.forEach(group => {
    for (let i = 0; i < 80; i++) {
      const url = `https://source.unsplash.com/500x500/?${group.query}&sig=${Math.random()}`;
      additionalAvatars.push(url);
    }
  });

  return additionalAvatars;
};

// Generate the additional avatars and combine with the base avatars
const additionalAvatars = generateAdditionalAvatars();

// Export the full collection of default avatars
export const DEFAULT_AVATARS = [...BASE_AVATARS, ...additionalAvatars];

// Export a default avatar and cover image for the profile
export const DEFAULT_AVATAR = DEFAULT_AVATARS[0];
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop";
