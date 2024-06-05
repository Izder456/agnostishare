const result = document.getElementById('result');

function idFromUrl(url) {
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

function youtubeLink(id) {
    return `https://www.youtube.com/watch?v=${id}`;
}

function soundcloudLink(id) {
    return `https://soundcloud.com/user-${id}`;
}

function spotifyLink(id) {
    return `https://open.spotify.com/track/${id}`;
}

function convertLink(link) {
    let id = idFromUrl(link);
    let convertedLinks = {};
    
    if (link.includes('spotify.com')) {
        convertedLinks['YouTube'] = youtubeLink(id);
        convertedLinks['SoundCloud'] = soundcloudLink(id);
        
        return convertedLinks;
    } else if (link.includes('youtube.com')) {
        convertedLinks['Spotify'] = spotifyLink(id);
        convertedLinks['SoundCloud'] = soundcloudLink(id);
        
        return convertedLinks;
    } else if (link.includes('soundcloud.com')) {
        convertedLinks['Spotify'] = spotifyLink(id);
        convertedLinks['YouTube'] = youtubeLink(id);
        
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
