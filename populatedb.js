#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function categoryCreate(name, cb) {
  categorydetail = { name: name }
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function itemCreate(name, description, category, price, stock, cb) {
  itemdetail = { 
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock
  }
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Phones', callback);
        },
        function(callback) {
          categoryCreate('Laptops', callback);
        },
        function(callback) {
          categoryCreate('Graphics Cards', callback);
        },
        function(callback) {
          categoryCreate('Central Processing Units', callback);
        },
        function(callback) {
          categoryCreate('Random Access Memory', callback);
        },
        function(callback) {
          categoryCreate('Hard Disc Drives', callback);
        },
        function(callback) {
          categoryCreate('Solid State Drives', callback);
        },
        function(callback) {
          categoryCreate("Motherboards", callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Samsung Galaxy S22 Ultra 512GB', "The Samsung S22 Ultra is a high-end smartphone with a large 6.8-inch Dynamic AMOLED display and a resolution of 3088 x 1440. It is powered by the Snapdragon 8 Gen 1 or Samsung's own Exynos 2200 processor, depending on the region, and comes with 8GB of RAM. It has a quad-camera setup on the back, with a 108MP main camera, a 12MP ultra-wide camera, a 3D depth sensor, and a 10MP periscope telephoto camera that supports up to 100x Space Zoom. It also features a 40MP front-facing camera and a 5,000mAh battery with fast charging and wireless charging capabilities. It runs on the latest version of Samsung's One UI, based on Android 11, and has 5G connectivity.", categories[0], 1499.99, 11, callback)
        },
        function(callback) {
          itemCreate('Asus TUF Gaming F15 2022 RTX 3050 Ti Core i5 11400H', 'The Asus TUF Gaming F15 2022 is a high-performance laptop designed for gaming and other demanding tasks. It features a 15.6-inch 144Hz Full HD IPS display and is powered by the 11th Gen Intel Core i5-11400H processor, along with the NVIDIA GeForce RTX 3050 Ti graphics card. The processor provides a base clock speed of 2.6GHz, and with the help of the 4 cores and 8 threads, it can boost up to 4.4GHz. The RTX 3050 Ti has 4GB of GDDR6 memory, which allows you to run games and other demanding applications smoothly. The laptop comes with 8GB of DDR4 RAM (expandable up to 32GB) and 512GB of NVMe SSD storage. It also has a backlit keyboard, Wi-Fi 6 and Bluetooth 5.2, and a USB Type-C port. The TUF gaming laptops are designed to be rugged, and this one is MIL-STD-810H military standard for durability and ruggedness. It also features a fast-charging battery that can last up to 8 hours on a single charge.', categories[1], 829.99, 6, callback)
        },
        function(callback) {
          itemCreate('Asus TUF Gaming GeForce RTX 3070 Ti 8GB', "The ASUS TUF Gaming GeForce RTX 3070 Ti is a high-performance graphics card designed for gaming and other demanding tasks. It is built on the NVIDIA's Ampere architecture and features 8GB of GDDR6 memory and a memory clock speed of 14 Gbps. The GPU has a boost clock speed of 1815 MHz and has a CUDA core count of 6144, which allows it to handle even the most demanding games and applications with ease. The card supports real-time ray tracing, AI-enhanced graphics, and NVIDIA DLSS, which allows for improved image quality and performance. It also has support for HDMI 2.1, DisplayPort 1.4a, and VirtualLink. The TUF Gaming graphics card comes with a durable design that includes a reinforced frame, a heatsink with three powerful fans, and an IP5X-certified dust resistant design. The card is designed to be overclockable and you can use the ASUS GPU Tweak II software to fine-tune the card to your specific needs.", categories[2], 750, 0, callback)
        },
        function(callback) {
          itemCreate('Western Digital 2TB WD Blue Internal Hard Drive', 'The Western Digital 2TB WD Blue is a high-capacity internal hard drive that provides reliable storage for your personal and professional needs. It has a storage capacity of 2TB which allows you to store large amounts of data, including photos, videos, music, and documents. It uses the SATA III interface with a 6 Gb/s transfer rate, which enables fast data transfer speeds. The hard drive has a 7200 RPM spindle speed, which provides faster access times and improved performance compared to slower 5400 RPM drives. It also features a large cache buffer of 64MB which can improve the overall performance of the drive. The hard drive is compatible with both Windows and Mac operating systems and is easy to install, it comes with a 3-year limited warranty. With its high storage capacity, fast transfer speeds, and reliable performance, the Western Digital 2TB WD Blue hard drive is an ideal storage solution for your everyday needs.', categories[5], 82.99, 36, callback)
        },
        function(callback) {
          itemCreate('Samsung 990 Pro 2TB M.2 SSD', "The Samsung 990 Pro 2TB SSD is a high-performance solid-state drive that utilizes the NVMe interface to deliver fast read and write speeds. It has a storage capacity of 2 terabytes and is built with Samsung's V-NAND technology, which provides high endurance and reliability. The drive also features a 5-year warranty and is optimized for use in high-end PCs and workstations. Additionally, it comes with Samsung's Magician software which allows users to easily manage and monitor the drive's performance.", categories[6], 300, 9, callback)
        },
        function(callback) {
          itemCreate('Asus ROG Strix B660-I Gaming WIFI Motherboard', "The Asus ROG Strix B660-I Gaming WIFI is a compact Mini-ITX motherboard designed for gaming and high-performance PCs. It is built with the Intel B660 chipset and supports 11th Gen Intel Core processors. The board features an integrated Intel WiFi 6 (802.11ax) and Bluetooth 5.2, providing fast wireless connectivity. It also has 2 DDR4 memory slots supporting up to 64GB of RAM with speeds up to 2933MHz.  For storage, it has 1x M.2 NVMe SSD slot and 1x SATA 6 Gbps port. The motherboard also includes a high-quality audio subsystem with a 120dB SNR stereo codec, which supports DTS Sound Unbound for an immersive audio experience.  Additionally, it has an Intel I219-V Gigabit Ethernet controller and USB 3.2 Gen 2 ports for fast data transfer. The board also has an Aura Sync RGB header for customizable lighting effects. The ROG Strix B660-I Gaming WIFI motherboard is designed for gamers and enthusiasts who are looking for a compact yet powerful motherboard for their high-performance builds.", categories[7], 270.50, 8, callback)
        },
        function(callback) {
          itemCreate('MSI MAG B660M Mortar WIFI Motherboard', 'The MSI MAG B660M Mortar WIFI is a micro-ATX motherboard built with the Intel B660 chipset, supporting the 11th Gen Intel Core processors. It features 2 DDR4 memory slots that can support up to 64GB of RAM with speeds up to 2933MHz. It also has 1x M.2 NVMe SSD slot and 4x SATA 6 Gbps ports for storage.  The board has an integrated Intel WiFi 6 (802.11ax) and Bluetooth 5.1 for fast wireless connectivity, and also has an Intel I219-V Gigabit Ethernet controller for wired networking. It also includes USB 3.2 Gen 2 ports for fast data transfer.  The MSI MAG B660M Mortar WIFI also features an audio subsystem with a high-quality ALC892 codec and Audio Boost technology for an immersive audio experience. Additionally, it has an extended heatsink for better cooling and an EZ Debug LED for easy troubleshooting. The board also has an RGB header for customizable lighting effects. The MSI MAG B660M Mortar WIFI is a solid choice for those looking to build a high-performance PC in a micro-ATX form factor.', categories[7], 200, 0, callback)
        }
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




