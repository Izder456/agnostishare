const musicLink = document.getElementById('musicLink');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');

function extractIdFromUrl(url) {
    let id;
    
    if (url.includes('spotify.com')) {
        const pathParts = new URL(url).pathname.split('/');
        if (pathParts.length > 2 && ['track', 'album', 'artist'].includes(pathParts[1])) {
            id = pathParts[2];
        }
    } else if (url.includes('youtube.com') && url.includes('watch?')) {
        const params = new URLSearchParams(new URL(url).search);
        id = params.get('v'); // 'v' parameter contains the video ID
    } else if (url.includes('soundcloud.com')) {
        const pathParts = new URL(url).pathname.split('/');
        if (pathParts.length > 2) {
            id = pathParts[pathParts.length - 1]; // Last part of the path is considered the ID
        }
    }

    return id || null; // Return null if no ID could be extracted
}

function convertLink(link) {
    let convertedLinks = {};
    let platform = "";

    if (link.includes('spotify.com')) {
        platform = 'Spotify';
    } else if (link.includes('youtube.com')) {
        platform = 'YouTube';
    } else if (link.includes('soundcloud.com')) {
        platform = 'SoundCloud';
    } else {
        return { error: 'Unsupported platform' };
    }

    let id = extractIdFromUrl(link);

    switch (platform) {
        case 'Spotify':
            convertedLinks['YouTube'] = `https://www.youtube.com/watch?v=${id}`;
            convertedLinks['SoundCloud'] = `https://soundcloud.com/user-${id}`;
            break;
        case 'YouTube':
        convertedLinks['Spotify'] = `https://open.spotify.com/track/${id}`;
        convertedLinks['SoundCloud'] = `https://soundcloud.com/tracks/${id}`;
            break;
        case 'SoundCloud':
            convertedLinks['Spotify'] = `https://open.spotify.com/artist/${id}`;
            convertedLinks['YouTube'] = `https://www.youtube.com/channel/${id}`;
            break;
        default:
            return { error: 'Failed to Convert Link'};
}

return convertedLinks;
}

function displayResult(links) {
    if (links.error) {
        result.innerHTML = `<p>${links.error}</p>`;
    } else {
        let resultHTML = '';
        for (const platform in links) {
            resultHTML += `<p><strong>${platform}:</strong> ${links[platform]}</p>`;
        }
        result.innerHTML = resultHTML;
    }
}

convertBtn.addEventListener('click', () => {
    const link = musicLink.value.trim();
    if (link) {
        const convertedLinks = convertLink(link);
        displayResult(convertedLinks);
    } else {
        result.innerHTML = '<p>Please enter a valid music link.</p>';
    }
});
