const touristSights = {
    California: [
        "Golden Gate Bridge",
        "Disneyland",
        "Yosemite National Park"
    ],
    Texas: [
        "The Alamo",
        "Space Center Houston",
        "Big Bend National Park"
    ],
    Florida: [
        "Walt Disney World",
        "Everglades National Park",
        "Miami Beach"
    ],
    NewYork: [
        "Statue of Liberty",
        "Central Park",
        "Niagara Falls"
    ],
    Illinois: [
        "Millennium Park",
        "Navy Pier",
        "Willis Tower"
    ],
    Alabama: ["U.S. Space & Rocket Center", "Gulf Shores Beach", "Birmingham Civil Rights Institute"],
    Alaska: ["Denali National Park", "Mendenhall Glacier", "Kenai Fjords National Park"],
    Arizona: ["Grand Canyon", "Antelope Canyon", "Sedona Red Rocks"],
    Arkansas: ["Hot Springs National Park", "Crystal Bridges Museum", "Buffalo National River"],
    Colorado: ["Rocky Mountain National Park", "Garden of the Gods", "Mesa Verde National Park"],
    Connecticut: ["Mystic Seaport", "Yale University", "Gillette Castle State Park"],
    Delaware: ["Rehoboth Beach", "Hagley Museum", "Nemours Mansion"],
    Georgia: ["Georgia Aquarium", "Savannah Historic District", "Stone Mountain Park"],
    Hawaii: ["Waikiki Beach", "Haleakalā National Park", "Pearl Harbor"],
    Idaho: ["Shoshone Falls", "Craters of the Moon", "Sun Valley Resort"],
    Indiana: ["Indianapolis Motor Speedway", "Indiana Dunes", "Children's Museum of Indianapolis"],
    Iowa: ["Field of Dreams Movie Site", "Amana Colonies", "Pikes Peak State Park"],
    Kansas: ["Sedgwick County Zoo", "Monument Rocks", "Botanica Wichita"],
    Kentucky: ["Mammoth Cave National Park", "Churchill Downs", "Kentucky Horse Park"],
    Louisiana: ["French Quarter", "Bourbon Street", "National WWII Museum"],
    Maine: ["Acadia National Park", "Portland Head Light", "Old Orchard Beach"],
    Maryland: ["National Aquarium", "Fort McHenry", "Ocean City Boardwalk"],
    Massachusetts: ["Freedom Trail", "Fenway Park", "Martha's Vineyard"],
    Michigan: ["Mackinac Island", "Sleeping Bear Dunes", "Detroit Institute of Arts"],
    Minnesota: ["Mall of America", "Boundary Waters", "Minneapolis Sculpture Garden"],
    Mississippi: ["Vicksburg National Military Park", "Gulf Islands National Seashore", "Natchez Trace Parkway"],
    Missouri: ["Gateway Arch", "Silver Dollar City", "Branson Strip"],
    Montana: ["Glacier National Park", "Yellowstone National Park", "Big Sky Resort"],
    Nebraska: ["Henry Doorly Zoo", "Chimney Rock", "Scotts Bluff National Monument"],
    Nevada: ["Las Vegas Strip", "Hoover Dam", "Lake Tahoe"],
    "New Hampshire": ["Mount Washington", "Hampton Beach", "Strawbery Banke Museum"],
    "New Jersey": ["Atlantic City Boardwalk", "Liberty State Park", "Cape May"],
    "New Mexico": ["White Sands National Park", "Carlsbad Caverns", "Taos Pueblo"],
    "North Carolina": ["Biltmore Estate", "Great Smoky Mountains", "Outer Banks"],
    "North Dakota": ["Theodore Roosevelt National Park", "Fargo Air Museum", "International Peace Garden"],
    Ohio: ["Rock & Roll Hall of Fame", "Cedar Point", "Hocking Hills State Park"],
    Oklahoma: ["Oklahoma City National Memorial", "Tulsa Zoo", "Route 66 Museum"],
    Oregon: ["Crater Lake National Park", "Multnomah Falls", "Portland Japanese Garden"],
    Pennsylvania: ["Liberty Bell", "Gettysburg National Military Park", "Hersheypark"],
    "Rhode Island": ["The Breakers", "Cliff Walk", "Roger Williams Park Zoo"],
    "South Carolina": ["Charleston Historic District", "Myrtle Beach", "Fort Sumter"],
    "South Dakota": ["Mount Rushmore", "Badlands National Park", "Custer State Park"],
    Tennessee: ["Graceland", "Great Smoky Mountains", "Dollywood"],
    Utah: ["Zion National Park", "Arches National Park", "Bryce Canyon"],
    Vermont: ["Stowe Mountain Resort", "Ben & Jerry's Factory", "Lake Champlain"],
    Virginia: ["Colonial Williamsburg", "Shenandoah National Park", "Virginia Beach"],
    Washington: ["Space Needle", "Mount Rainier National Park", "Pike Place Market"],
    "West Virginia": ["New River Gorge Bridge", "Seneca Rocks", "Harpers Ferry"],
    Wisconsin: ["Wisconsin Dells", "Lambeau Field", "Milwaukee Art Museum"],
    Wyoming: ["Yellowstone National Park", "Grand Teton National Park", "Devils Tower"],
};

// For each state, add 2 more attractions to the array. Use 'Attraction 4' and 'Attraction 5' as placeholders if needed.
Object.keys(touristSights).forEach(state => {
    const current = touristSights[state];
    if (current.length < 5) {
        for (let i = current.length + 1; i <= 5; i++) {
            current.push(`Attraction ${i}`);
        }
    }
});

export default touristSights; 