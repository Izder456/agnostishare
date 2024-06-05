const result = document.getElementById('result');

function extractIdFromUrl(url) {
    if (url.includes('spotify.com')) {
        const pathParts = new URL(url).pathname.split('/');
        
        if (pathParts.length > 2 && ['track', 'album', 'artist'].includes(pathParts[1])) {
            return pathParts[2];
        } else {
            return new Error("No ID could be extracted");
        }
    } else if (url.includes('youtube.com') && url.includes('watch?')) {
        return new URLSearchParams(new URL(url).search).get('v');
    } else if (url.includes('soundcloud.com')) {
        const pathParts = new URL(url).pathname.split('/');
        
        if (pathParts.length > 2) {
            return pathParts[pathParts.length - 1];
        } else {
            return new Error("No ID could be extracted");
        }
    } else {
        return new Error("No ID could be extracted");
    }
}

function convertLink(link) {
    let id = extractIdFromUrl(link);

    if (link.includes('spotify.com')) {
        convertedLinks['YouTube'] = `https://www.youtube.com/watch?v=${id}`;
        convertedLinks['SoundCloud'] = `https://soundcloud.com/user-${id}`;
        
        return convertedLinks;
    } else if (link.includes('youtube.com')) {
        convertedLinks['Spotify'] = `https://open.spotify.com/track/${id}`;
        convertedLinks['SoundCloud'] = `https://soundcloud.com/tracks/${id}`;
        
        return convertedLinks;
    } else if (link.includes('soundcloud.com')) {
        convertedLinks['Spotify'] = `https://open.spotify.com/artist/${id}`;
        convertedLinks['YouTube'] = `https://www.youtube.com/channel/${id}`;
        
        return convertedLinks;
    } else {
        return new Error('Unsupported platform');
    }
}

function displayResult(links) {
    if (links.error) {
        result.innerHTML = `<p>${links.error}</p>`;
    } else {
        for (const platform in links) {
            result.innerHTML += `<p><strong>${platform}:</strong> ${links[platform]}</p>`;
        }
    }
}

document.getElementById('convertBtn').addEventListener('click', () => {
    const link = document.getElementById('musicLink').value.trim();
    
    if (link) {
        displayResult(convertLink(link));
    } else {
        result.innerHTML = '<p>Please enter a valid music link.</p>';
    }
});
