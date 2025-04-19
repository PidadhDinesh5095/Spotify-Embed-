const clientId = 'dfd48fc2bd6d4128b6d758f0743e0660';
const clientSecret = '9b259cb20c2d4fc8b56aedd9ce4d5d2e';

document.querySelector(".sign").addEventListener("click", function () {
    window.location.href = "login.html";
});

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    console.log(data.access_token);
    return data.access_token;
}

async function fetchAndStoreData(sections, token, startIndex = 0, endIndex = sections.length) {
    try {
        const allSections = JSON.parse(sessionStorage.getItem('sectionsData')) || [];

        for (let i = startIndex; i < endIndex; i++) {
            const sectionInfo = sections[i];
            const response = await fetch(sectionInfo.url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);

            let items;
            if (sectionInfo.type === 'album') {
                items = data.albums.items;
            } else if (sectionInfo.type === 'artist') {
                items = data.artists.items;
            } else if (sectionInfo.type === 'playlist') {
                items = data.playlists.items;
            } else if (sectionInfo.type === 'show') {
                items = data.shows.items;
            } else if (sectionInfo.type === 'track') {
                items = data.tracks.items;
            } else {
                console.warn(`Unknown type: ${sectionInfo.type}`);
                continue;
            }

            const sectionData = {
                name: sectionInfo.name,
                items: items,
                type: sectionInfo.type
            };
            allSections.push(sectionData);
        }

        sessionStorage.setItem('sectionsData', JSON.stringify(allSections));
        displaySectionsFromSessionStorage();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function showLoadingEffect() {
    const mainContainer = document.getElementById('main-content');

    for (let i = 0; i < 5; i++) {
        const section = document.createElement('section');
        section.classList.add('url-section', 'p-4', 'mb-6');

        const artistContainer = document.createElement('div');
        artistContainer.classList.add('artist-container', 'flex', 'overflow-x-auto', 'gap-4', 'pb-6');

        for (let j = 0; j < 10; j++) {
            const artistCard = document.createElement('div');
            artistCard.classList.add('artist-card', 'rounded','flex','flex-col', 'gap-1', 'p-0', 'w-30','h-30');

            const img = document.createElement('div');
            img.classList.add('bg-gray-700','w-full', 'h-36', 'animate-pulse','rounded-lg');
            artistCard.appendChild(img);

            const name = document.createElement('div');
            name.classList.add('bg-gray-700', 'w-28', 'h-4','animate-pulse', 'rounded-lg');
            artistCard.appendChild(name);

            const artistNames = document.createElement('div');
            artistNames.classList.add('bg-gray-700', 'w-36', 'h-4','animate-pulse', 'rounded-lg');
            artistCard.appendChild(artistNames);

            artistContainer.appendChild(artistCard);
        }

        section.appendChild(artistContainer);
        mainContainer.appendChild(section);
    }
}

function displaySectionsFromSessionStorage() {
    const mainContainer = document.getElementById('main-content');
    const sectionsData = JSON.parse(sessionStorage.getItem('sectionsData'));

    mainContainer.innerHTML = '';

    if (sectionsData) {
        sectionsData.forEach(sectionData => {
            const section = document.createElement('section');
            section.classList.add('url-section', 'p-1');

            const sectionTitle = document.createElement('h1');
            sectionTitle.innerText = sectionData.name;
            sectionTitle.classList.add('text-white', 'section-title', 'text-[1.6rem]', 'font-black', 'font-poppins');
            mainContainer.appendChild(sectionTitle);

            sectionData.items.forEach(item => {
                if (item && (item.images && item.images[0]?.url || item.album?.images[0]?.url)) {
                    let imgSrc, nameText;

                    if (sectionData.type === 'track') {
                        imgSrc = item.album.images[0].url;
                        nameText = item.album.name;
                    } else {
                        imgSrc = item.images[0].url;
                        nameText = item.name;
                    }

                    if (imgSrc) {
                        const artistCard = document.createElement('div');
                        artistCard.classList.add('artist-card', 'p-1', 'h-[240px]', 'flex', 'flex-col', 'justify-evenly');
                        artistCard.style.cursor = 'pointer';

                        const img = document.createElement('div');
                        img.style.backgroundImage = `url(${imgSrc})`;
                        img.style.backgroundSize = 'cover';
                        img.style.backgroundPosition = 'center';
                        img.style.width = '100%';
                        img.style.height = '65%';

                        if (sectionData.type === 'artist') {
                            img.classList.add('rounded-full');
                        } else {
                            img.classList.add('rounded');
                        }
                        img.addEventListener('click', () => {
    const itemWithType = { ...item, type: sectionData.type };
    sessionStorage.setItem('itemData', JSON.stringify(itemWithType));

    var btmSec=document.getElementById('ifr');
    btmSec.classList.remove('hidden');
    const iframe = document.querySelector('#bottomplayer');

    if (iframe) {
        iframe.src = `https://open.spotify.com/embed/${sectionData.type }/${item.id}`;
    }

  document.getElementById('preview').click();
});
                        artistCard.appendChild(img);
                        const desc = document.createElement('div');
desc.classList.add('h-[40%]', 'w-full', 'relative');
const names = document.createElement('div');
names.classList.add('w-full', 'h-[100%]', 'flex', 'flex-col', 'justify-start');

const name = document.createElement('h3');
name.innerText = nameText || 'Unknown Name';
name.classList.add('text-white', 'text-bold', 'p-2', 'font-poppins');
names.appendChild(name);

if (item.artists && item.artists.length > 0) {
    const artistNames = document.createElement('h7');
    artistNames.classList.add('text-gray-300', 'font-poppins', 'p-2');
    artistNames.innerText = item.artists
        .slice(0, 2)
        .map(artist => artist.name)
        .join(', ');
    names.appendChild(artistNames);
}

const btn = document.createElement('button');
btn.classList.add('h-8', 'w-8', 'rounded-full', 'opacity-100', 'hover:opacity-100', 'flex', 'items-center', 'justify-center', 'btn');
btn.style.position = 'absolute';
btn.style.bottom = '40px';
btn.style.right = '10px';
btn.style.transition = 'opacity 0.3s';

btn.innerHTML = `
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="15px"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" fill="white"></path></svg>
`;

document.body.appendChild(btn);

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

btn.addEventListener('click', () => {
  const currentCheckedBtn = document.querySelector('input[type="checkbox"]:checked');

  checkboxes.forEach(checkbox => {
    if (checkbox !== currentCheckedBtn) {
      checkbox.checked = false;
    }
  });
});
desc.append(names);
btn.addEventListener('click', () => {
    const itemWithType = { ...item, type: sectionData.type };
    sessionStorage.setItem('itemData', JSON.stringify(itemWithType));
var btmSec=document.getElementById('ifr');
    btmSec.classList.remove('hidden');

    const iframe = document.querySelector('#bottomplayer');
    if (iframe) {
        iframe.src = `https://open.spotify.com/embed/${sectionData.type }/${item.id}`;
    }

});
desc.append(btn);

artistCard.append(desc);
                        section.appendChild(artistCard);
                    }
                }
            });

            mainContainer.appendChild(section);
        });
    }
}

(async () => {
    const token = await getAccessToken();
    const sections = [
        { name: 'For You', url: 'https://api.spotify.com/v1/search?q=Made For You%20Love&type=track&limit=50', type: 'track' },
        { name: 'Top Telugu', url: 'https://api.spotify.com/v1/search?q=latesttelugu&type=album&limit=50', type:'album'},
        { name: 'Top Artists', url: 'https://api.spotify.com/v1/search?q=latest%20south&type=artist&limit=50', type: 'artist'},
        { name: 'Trending Now', url: 'https://api.spotify.com/v1/search?q=trending&type=album&limit=20', type: 'album' },
        { name: 'Popular Podcasts', url: 'https://api.spotify.com/v1/search?q=bussinessandtechnology&type=show&limit=50', type: 'show' },
        { name: 'Charts', url: 'https://api.spotify.com/v1/search?q=newcharts&type=album&limit=50', type: 'album' },
        { name: 'Punjabi Hits', url: 'https://api.spotify.com/v1/search?q=punjabihits&type=playlist&limit=50', type: 'playlist' },
        { name: 'Netflix', url: 'https://api.spotify.com/v1/search?q=netflix&type=playlist&limit=50', type: 'playlist'},
        { name: 'Featuring New', url: 'https://api.spotify.com/v1/search?q=hindisongs&type=track&limit=50', type: 'track'},
        { name: 'Best of artists', url: 'https://api.spotify.com/v1/search?q=topsongsof artists&type=album&limit=50', type: 'album' },
        { name: 'Todays Biggest Hits', url: 'https://api.spotify.com/v1/search?q=newtoday&type=album&limit=50', type: 'album' },
        { name: 'Recomended for Today', url: 'https://api.spotify.com/v1/search?q=recomendedtoday%20telugu&type=playlist&limit=50', type: 'playlist'},
        { name: 'Popular Shows', url: 'https://api.spotify.com/v1/search?q=popularshows&type=show&limit=50', type: 'show' }
    ];

    if (!sessionStorage.getItem('sectionsData')) {
        showLoadingEffect();

        await fetchAndStoreData(sections, token, 0, 3);

        await fetchAndStoreData(sections, token, 3, sections.length);
    } else {
        displaySectionsFromSessionStorage();
    }
})();
document.getElementById('preview').addEventListener('click', async () => {
	const bottomSection = document.getElementById('bottom-section');
	const iframe = document.getElementById('bottomplayer');
  const pre=document.getElementById('preview');
  
  pre.classList.remove('bg-[url(preview.svg)]');

let existingNavBar = document.getElementById('customNavBar');
let existingArtistContainer = document.getElementById('artistContainer');
if (existingNavBar) existingNavBar.remove();
if (existingArtistContainer) existingArtistContainer.remove();

bottomSection.classList.remove('h-[100px]');
bottomSection.classList.add('h-[100vh]', 'bg-black', 'overflow-y-auto', 'flex', 'flex-col');
bottomSection.classList.remove('bottom-[70px]');
bottomSection.classList.add('top-0');

iframe.classList.remove('h-full');
iframe.classList.add('h-[400px]');

const itemData = JSON.parse(sessionStorage.getItem('itemData'));

let itemName = itemData?.name || 'Unknown Name';

let artistName = 'Unknown Artist';
let artistImage ;

if (itemData?.type != 'track') {
	if(itemData.type === 'artist'){
    artistName = itemData.name ;
   }else{
   	artistName='Unknown Artist';
   }
    artistImage = itemData?.images?.[0]?.url ;
} else {
    let fetchedArtist = await fetchSpotifyArtist(itemData?.artists?.[0]?.name || '');
    artistName = fetchedArtist.name;
    artistImage = fetchedArtist.image;
}

async function fetchSpotifyArtist(artistName) {
    if (!artistName) return { name: 'Unknown Artist', image: artistImage };

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`;
    const accessToken = await getAccessToken();

    try {
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const data = await response.json();

        if (data.artists?.items.length > 0) {
            let artist = data.artists.items[0];
            return {
                name: artist.name || 'Unknown Artist',
                image: artist.images.length > 0 ? artist.images[0].url : artistImage
            };
        }
    } catch (error) {
        console.error("Error fetching artist data:", error);
    }

    return { name: 'Unknown Artist', image: artistImage };
}

let navBar = document.createElement('div');
navBar.id = 'customNavBar';
navBar.classList.add(
    'w-full', 'h-[50px]', 'bg-gradient-to-b', 'from-black', 'to-transparent',
    'text-white', 'flex', 'items-center', 'justify-start',
    'fixed', 'top-0', 'left-0', 'z-50', 'px-4'
);

let svgContainer = document.createElement('div');
svgContainer.classList.add('p-2', 'flex', 'items-center', 'justify-center', 'cursor-pointer');

let svgIcon = document.createElement('span');
svgIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20px">
        <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
    </svg>
`;

svgContainer.appendChild(svgIcon);

let title = document.createElement('h2');
title.innerText = itemName;
title.classList.add('text-white','font-black','text-xl', 'tracking-wide','ml-4','truncate');

navBar.appendChild(svgContainer);
navBar.appendChild(title);

document.body.appendChild(navBar);

let artistContainer = document.createElement('div');
artistContainer.id = 'artistContainer';
artistContainer.classList.add('w-full','flex', 'flex-col', 'items-center', 'justify-center', 'text-white');

let artistImg = document.createElement('img');
artistImg.src = artistImage;
artistImg.alt = artistName;
artistImg.classList.add('w-[100%]', 'h-[600px]', 'rounded-lg', 'object-cover','object-top');

let artistTitle = document.createElement('h3');
artistTitle.innerText = artistName;
artistTitle.classList.add(
    'relative',
    'bottom-[58px]',
    'w-full',
    'text-white',
    'bg-gradient-to-t',
    'from-black/100',
    'to-black/0',
    'p-2',
    'text-[2rem]',
    'font-bold',
    'text-center'
);
let aboutArtist=document.createElement('div');
    aboutArtist.classList.add('w-full','m-6','flex','justify-start','items-center','bg-gradient-to-t','from-black/0','to-black/100');
 let aboutArtistText = document.createElement('h1');
aboutArtistText.innerText = 'About the Artist';
aboutArtistText.classList.add('text-[2rem]','font-black',);
aboutArtist.appendChild(aboutArtistText);

artistContainer.appendChild(aboutArtist);
artistContainer.appendChild(artistImg);
artistContainer.appendChild(artistTitle);

iframe.insertAdjacentElement('afterend', artistContainer);

svgContainer.addEventListener('click', () => {
    bottomSection.classList.remove('h-[100vh]', 'bg-black', 'overflow-y-auto');
    bottomSection.classList.add('h-[100px]');
    bottomSection.classList.remove('top-0');
    bottomSection.classList.add('bottom-[45px]');
    iframe.classList.remove('h-[400px]');
    iframe.classList.add('h-full');
const pre=document.getElementById('preview');
  pre.classList.add('bg-[url(preview.svg)]');
    if (navBar) navBar.remove();

    if (artistContainer) artistContainer.remove();
});

});
const fullPage = document.getElementById("fullPage");
const search = document.getElementById("search");
const section = document.getElementById("songs");

search.addEventListener("click", () => {
    fullPage.classList.remove("hidden");
    cat.classList.add('hidden');
    
});



let debounceTimer;

async function fetchSongs(query) {
    if (!query) return;

    showLoading();
    const accessToken = await getAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`;

    try {
        const response = await fetch(searchUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        appendSongsToSection(data.tracks.items);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

function showLoading() {
    section.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const skeletonDiv = document.createElement("div");
        skeletonDiv.classList.add("song-card", "flex", "gap-4", "p-4", "rounded-lg");

        const imgSkeleton = document.createElement("div");
        imgSkeleton.classList.add("w-16", "h-12", "bg-gray-300", "animate-pulse", "rounded-md");

        const textSkeleton = document.createElement("div");
        textSkeleton.classList.add("flex", "flex-col", "gap-2", "animate-pulse", "w-full");

        const nameSkeleton = document.createElement("div");
        nameSkeleton.classList.add("w-full", "h-4", "bg-gray-300", "animate-pulse", "rounded-md");

        const artistSkeleton = document.createElement("div");
        artistSkeleton.classList.add("w-1/3", "h-3", "bg-gray-300", "animate-pulse", "rounded-md");

        textSkeleton.appendChild(nameSkeleton);
        textSkeleton.appendChild(artistSkeleton);
        skeletonDiv.appendChild(imgSkeleton);
        skeletonDiv.appendChild(textSkeleton);
        section.appendChild(skeletonDiv);
    }
}

function appendSongsToSection(songs) {
    section.innerHTML = "";

    if (songs.length === 0) {
        section.innerHTML = "<p>No songs found.</p>";
        return;
    }

    songs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song-card", "flex", "gap-4", "p-4", "rounded-lg");

        const img = document.createElement("img");
        img.src = song.album.images[0]?.url || "default-image.jpg";
        img.alt = song.name;
        img.classList.add("w-16", "h-16", "rounded-md");

        const textDiv = document.createElement("div");
        textDiv.classList.add("flex", "flex-col", "justify-start", "w-full");

        const title = document.createElement("h3");
        title.textContent = song.name;
        title.classList.add("text-white", "font-bold", "titles","truncate");

        const artist = document.createElement("p");
        artist.classList.add("text-gray-300", "font-poppins");
        artist.innerText = song.artists.slice(0, 2).map(artist => artist.name).join(", ");

        textDiv.appendChild(title);
        textDiv.appendChild(artist);
        songDiv.appendChild(img);
        songDiv.appendChild(textDiv);
        songDiv.addEventListener("click", () => {
            const itemWithType = { ...song, type: song.type };
            sessionStorage.setItem("itemData", JSON.stringify(itemWithType));
            var btmSec = document.getElementById("ifr");
            btmSec.classList.remove("hidden");

            let recents = JSON.parse(sessionStorage.getItem("recents")) || [];
            const isDuplicate = recents.some(item => JSON.stringify(item) === JSON.stringify(itemWithType));

            if (!isDuplicate) {
                recents.unshift(itemWithType);
                if (recents.length > 7) {
                    recents.pop();
                }
                sessionStorage.setItem("recents", JSON.stringify(recents));
            }

            document.querySelectorAll(".titles").forEach(title => {
                title.classList.remove("text-green-500");
                title.classList.add("text-white");
            });

            title.classList.remove("text-white");
            title.classList.add("text-green-500");

            const iframe = document.querySelector("#bottomplayer");
            if (iframe) {
                iframe.src = `https://open.spotify.com/embed/${itemWithType.type}/${itemWithType.id}`;
            }
        });

        section.appendChild(songDiv);

        if (index === 0) {
            songDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

function handleInput(event) {
    const query = event.target.value.trim();
    if (!query) {
        section.innerHTML = "";
        const recentsTitle = document.createElement("h2");
        recentsTitle.textContent = "Recents";
        recentsTitle.classList.add("text-white", "font-bold", "text-2xl", "m-4");
        section.appendChild(recentsTitle);

        const recents = JSON.parse(sessionStorage.getItem("recents")) || [];

        if (recents.length === 0) {
            section.innerHTML = "<p class='m-2 text-[900] text-[1.2rem] text-gray-300'>No recent songs available.</p>";
            return;
        }

        recents.forEach(song => {
            const songDiv = document.createElement("div");
            songDiv.addEventListener("click", () => {
                const itemWithType = { ...song, type: song.type };
                var btmSec = document.getElementById("ifr");
                btmSec.classList.remove("hidden");
                sessionStorage.setItem("itemData", JSON.stringify(itemWithType));

                document.querySelectorAll(".titles").forEach(title => {
                    title.classList.remove("text-green-500");
                    title.classList.add("text-white");
                });

                title.classList.remove("text-white");
                title.classList.add("text-green-500");

                const iframe = document.querySelector("#bottomplayer");
                if (iframe) {
                    iframe.src = `https://open.spotify.com/embed/${itemWithType.type}/${itemWithType.id}`;
                }
            });

            songDiv.classList.add("song-card", "flex", "gap-4", "p-4", "rounded-lg");

            const img = document.createElement("img");
            img.src = song.album?.images?.[0]?.url || "default-image.jpg";
            img.alt = song.name;
            img.classList.add("w-16", "h-16", "rounded-md");

            const textDiv = document.createElement("div");
            textDiv.classList.add("flex", "flex-col", "justify-start", "w-full");

            const title = document.createElement("h3");
            title.textContent = song.name;
            title.classList.add("text-white", "font-bold", "titles");

            const artist = document.createElement("p");
            artist.classList.add("text-gray-300", "font-poppins");
            artist.innerText = song.artists.slice(0, 2).map(artist => artist.name).join(", ");

            textDiv.appendChild(title);
            textDiv.appendChild(artist);
            songDiv.appendChild(img);
            songDiv.appendChild(textDiv);
            section.appendChild(songDiv);
        });

        return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchSongs(query);
    }, 1000);
}

document.getElementById("searchInput").addEventListener("input", handleInput);

window.addEventListener("resize", function () {
    const nav = document.getElementById("nav");
    const bottomSection = document.getElementById("bottom-section");

    if (window.innerHeight < 500) {
        nav.classList.add("hidden");
        bottomSection.classList.add("hidden");
    } else {
        nav.classList.remove("hidden");
        bottomSection.classList.remove("hidden");
    }
});

document.getElementById("searchInput").addEventListener("click", function () {
    this.select();
});
const cards = [
  { name: "Made For You", color: "#673ab7", imageSrc: "img.jpg" },
  { name: "New Releases", color: "#4caf30", imageSrc: "FRIDA" },
  { name: "Hindi", color: "#e91e63", imageSrc: "BOLLYWOOD CENTRAL" },
  { name: "Punjabi", color: "#2196f3", imageSrc: "Punjabi 1" },
  { name: "Tamil", color: "#ff9800", imageSrc: "Tollywood" },
  { name: "Telugu", color: "#ff5722", imageSrc: "HOT HITS" },
  { name: "Podcast Charts", color: "#9c27b0", imageSrc: "Top Podcasts" },
  { name: "Podcast New Releases", color: "#00bcd4", imageSrc: "Brana" },
  { name: "Beats", color: "#ff2a3e", imageSrc: "THE Joe Rogan EXPERIENCE" },
  { name: "Business & Technology", color: "#8bc34a", imageSrc: "FINANCE NEWS MADE SIMPLE" },
  { name: "Charts", color: "#673ab7", imageSrc: "Top Songs Global" },
  { name: "Malayalam", color: "#ff5722", imageSrc: "HOT HITS" },
  { name: "Bhojpuri", color: "#e91e63", imageSrc: "Summer" },
  { name: "Instrumental", color: "#ff5722", imageSrc: "Discover" },
  { name: "Radio", color:  "#4caf50", imageSrc: "Pop" },
  { name: "Indie", color: "#00bcd4", imageSrc: "Love" },
  { name: "Trending", color: "#ffab3b", imageSrc: "Mood" },
  { name: "Party", color: "#ff5722", imageSrc: "Devotional" },
  { name: "Anime", color:"#ffdb3b", imageSrc: "Your Weekly" },
  { name: "Golden", color: "#ff5722", imageSrc: "Golden" },
  { name: "Afro", color: "#2196f3", imageSrc: "TH" },
  { name: "Tastemakers", color:  "#673ab7", imageSrc: "Sia" },
  { name: "Sleep", color: "#e91e63", imageSrc: "Boc" },
  { name: "All New India", color: "#8bc34a", imageSrc: "All New India" },
  { name: "Netflix", color:  "#ff0000", imageSrc: "INTERNE" },
  { name: "Dance Party", color: "#ffeb3b", imageSrc: "Dance Party" },
  { name: "Hit", color: "#ff5722", imageSrc: "Hit" },
  { name: "Decades", color: "#e91e63", imageSrc: "All New" },
  { name: "Hip-Hop", color: "#00bcd4", imageSrc:"RapCavia" },
  { name: "Dance/Electronic", color:  "#2196f3", imageSrc: "Mix" },
  { name: "Student", color: "#fdad3b", imageSrc: "Study" },
  { name: "Chill", color: "#ffeb3b", imageSrc: "Chill" },
  { name: "Gaming", color: "#00bcd4", imageSrc: "Top 50 Gaming Tracks" },
  { name: "K-pop", color: "#f44336", imageSrc: "On" },
  { name: "Workout", color:  "#e91e63", imageSrc: "Workout" },
  { name: "RADAR", color: "#ff5722", imageSrc: "RADAR GLOBAL" },
  { name: "EQUAL", color: "#4caf50", imageSrc: "EQUAL" },
  { name: "Fresh Finds", color: "#ff9800", imageSrc: "Fresh Finds" },
  { name: "Rock", color: "#ff5722", imageSrc: "MARROON" }
];



const categories = [
  { name: "Songs", color: "rgb(0, 48, 73)", imageSrc: "songs-image" },
  { name: "Albums", color: "#2196f3", imageSrc: "podcasts-image" },
  { name: "Shows", color: "rgb(251, 86, 7)", imageSrc: "shows-image" },
  { name: "Playlists", color: "rgb(120, 0, 0)", imageSrc: "playlists-image" }
];

const cat = document.getElementById("cat");

// Create and append heading
const heading = document.createElement("h2");
heading.className = "text-white m-3 font-[900] text-2xl";
heading.textContent = "Discover new";
cat.appendChild(heading);

// Create and append grid container for cards
const gridContainer = document.createElement("div");
gridContainer.className = "grid grid-cols-2 gap-1 max-w-md";
cat.appendChild(gridContainer);

// Create category cards
cards.forEach(card => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "w-55 h-28 m-1 rounded p-3 flex justify-between items-start relative overflow-hidden";
  cardDiv.style.backgroundColor = card.color || "#ccc";

  // Card Title
  const title = document.createElement("h3");
  title.className = "text-white font-[900] text-[1.3rem]";
  title.textContent = card.name;

  // Image Element
  const img = document.createElement("img");
  img.src = card.imageSrc;
  img.className = "absolute shadow-xl bottom-[5px] right-[-10px] w-16 h-16 transform rotate-[20deg] opacity-100 rounded";

  cardDiv.appendChild(title);
  cardDiv.appendChild(img);

  // Click event for card
  cardDiv.addEventListener("click", () => {
    sessionStorage.setItem("selectedCategory", JSON.stringify({
      name: card.name,
      color: card.color
    }));

    const cat2 = document.getElementById("cat2");
    cat2.innerHTML = ""; // Clear previous content

    const storedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));
    const bgColor = storedCategory.color || "#4a90e2";

    // Create category div with gradient background
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "relative rounded-lg p-6 w-full h-[200px] flex items-end";
    categoryDiv.style.background = `linear-gradient(to bottom, ${bgColor} 1%, black 90%)`;

    // Create category name
    const categoryName = document.createElement("h3");
    categoryName.textContent = storedCategory.name;
    categoryName.className = "absolute bottom-6 left-4 text-white font-black ml-2 text-[3.3rem]";

    categoryDiv.appendChild(categoryName);
    cat2.prepend(categoryDiv);

    // Create navbar
    let nav = document.createElement('div');
    nav.id = 'customNav';
    nav.classList.add('w-full', 'h-[50px]','bg-gradient-to-b', `from-[${bgColor}]`, 'to-transparent',  'text-white', 'flex', 'items-center', 'justify-start', 'fixed', 'top-0', 'left-0','z-10', 'px-4');

    let sv = document.createElement('div');
    sv.classList.add('p-2', 'flex', 'items-center', 'justify-center', 'cursor-pointer');
    sv.addEventListener('click', () => {
      cat2.classList.add('hidden');
      nav.classList.add('hidden');
    });

    let svgIcon = document.createElement('span');
    svgIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20px">
          <path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
      </svg>
    `;

    sv.appendChild(svgIcon);

    let title = document.createElement('h2');
    title.innerText = storedCategory.name;
    title.classList.add('text-white', 'font-black', 'text-xl', 'text-center', 'tracking-wide', 'ml-4', 'truncate');
    
    nav.appendChild(sv);
    nav.appendChild(title);
    cat.appendChild(nav);

    // Show cat2
    cat2.classList.remove("hidden");

    // Fetch songs based on the selected category
    fetchSongsByCategory(storedCategory.name);
  });

  gridContainer.appendChild(cardDiv);
});

// Hero section
const hero = document.createElement("section");
hero.className = "my-8";

// Hero heading
const heroHeading = document.createElement("h2");
heroHeading.className = "text-2xl font-[900] text-white m-3";
heroHeading.textContent = "Browse by Category";

// Hero category grid
const categoryGridContainer = document.createElement("div");
categoryGridContainer.className = "grid grid-cols-2 gap-1 max-w-4xl mx-auto";
categories.forEach(category => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "w-55 h-[60px] rounded flex flex-col items-start justify-between relative overflow-hidden shadow-lg m-1";
  cardDiv.style.backgroundColor = category.color || "#ccc";

  // Category name
  const title = document.createElement("h3");
  title.className = "text-white font-[900] text-[1.3rem] m-2";
  title.textContent = category.name;

  // Image
  const img = document.createElement("img");
  img.src = category.imageSrc;
  img.className = "absolute bottom-[-2px] right-[-10px] rounded w-12 h-12 transform rotate-12 opacity-80";

  cardDiv.appendChild(title);
  cardDiv.appendChild(img);
  cardDiv.addEventListener('click',()=>{
  	let search=document.getElementById('searchInput');
  	
  	document.getElementById('search').click();
  	search.value=category.name;
  	search.dispatchEvent(new Event("input")); //
  })

  
  categoryGridContainer.appendChild(cardDiv);
});

// Append hero section
hero.appendChild(heroHeading);
hero.appendChild(categoryGridContainer);
const catContainer = document.getElementById("cat");
catContainer.prepend(hero);

// Event listener for category button
document.getElementById('catogory').addEventListener('click', () => {
  cat.classList.remove('hidden');
  fullPage.classList.add("hidden");
  let x=document.getElementById('about');
  x.classList.add('hidden');
});

// Fetch songs based on selected category
async function fetchSongsByCategory(categoryName) {
  try {
    const token = await getAccessToken();
    
    // Define valid categories and set type accordingly
    const validCategories = ["songs", "shows", "playlists", "Podcasts"];
let type = "track"; // Default type
let query = categoryName; // Default query

switch (categoryName.toLowerCase()) {
  case "songs":
    type = "track";
    break;
  case "playlists":
    type = "playlist";
    break;
  case "podcasts":
  case "shows":
    type = "show";
    break;
}

if (validCategories.includes(categoryName.toLowerCase())) {
  query = "telugu"; // Change query to Telugu if category matches
}

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch songs");
    }

    const data = await response.json();
    const tracks = data.tracks?.items || data[type]?.items || [];

    const cat2 = document.getElementById("cat2");
    const grid = document.createElement("section");
    grid.className = "grid grid-cols-2 ";
    cat2.appendChild(grid);

    tracks.forEach(track => {
      const songCard = document.createElement("div");
      songCard.className = "rounded-lg shadow-lg p-4";

      const songImg = document.createElement("img");
      songImg.src = track.album?.images[0]?.url || "default.jpg";
      songImg.className = "w-full h-auto m-1 ";

      const songDetails = document.createElement("div");
      songDetails.className = "m-2";

      const songName = document.createElement("h3");
      songName.className = "text-white font-bold text-lg truncate";
      songName.textContent = track.name;

      const artistName = document.createElement("p");
      artistName.className = "text-gray-300 text-sm truncate";
      artistName.textContent = `Artist: ${track.artists?.map(artist => artist.name).join(", ")}`;

      songDetails.appendChild(songName);
      songDetails.appendChild(artistName);

      songCard.appendChild(songImg);
      songCard.appendChild(songDetails);

      songCard.addEventListener('click', () => {
        const itemWithType = { ...track, type: track.type || type };
        sessionStorage.setItem('itemData', JSON.stringify(itemWithType));

        const btmSec = document.getElementById('ifr');
        btmSec.classList.remove('hidden');
        const iframe = document.querySelector('#bottomplayer');

        if (iframe) {
          iframe.src = `https://open.spotify.com/embed/${track.type || type}/${track.id}`;
        }

        document.getElementById('preview').click();
      });

      grid.appendChild(songCard);
    });

  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}
document.getElementById("home").addEventListener("click", () => {
    fullPage.classList.add("hidden");
    cat.classList.add('hidden');
    let x=document.getElementById('about');
    x.classList.add('hidden')
});
document.getElementById("aboutSec").addEventListener("click", () => {
    fullPage.classList.add("hidden");
    cat.classList.add('hidden');
    let x=document.getElementById('about');
    x.classList.remove('hidden')
});
