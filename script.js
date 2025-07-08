
async function searchSong() {
    const query = document.getElementById("songSearch").value.trim();
    const resultContainer = document.getElementById("result");
    
    if (!query) return alert("Vui lòng nhập tên bài hát!");
    
    resultContainer.innerHTML = "<p>🎵 Đang tìm kiếm...</p>";

    let token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");

    if (!token || (expiresAt && Date.now() >= expiresAt)) {
        alert("Token Spotify đã hết hạn. Đăng nhập lại!");
        logoutSpotify();
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 401) {
            logoutSpotify();
            return;
        }

        const data = await response.json();
        displayResults(data.tracks?.items || []);
        saveSearchHistory(query);
    } catch (error) {
        console.error("Lỗi tìm kiếm bài hát:", error);
        resultContainer.innerHTML = "<p>❌ Có lỗi xảy ra khi tìm kiếm!</p>";
    }
}

function displayResults(tracks) {
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
  
    tracks.forEach((track) => {
      const div = document.createElement("div");
      div.classList.add("song-item");
  
      div.innerHTML = `
        <img src="${track.album.images[0].url}" width="60">
        <div>
          <p><strong>${track.name}</strong> - ${track.artists.map(a => a.name).join(", ")}</p>
          <a href="${track.external_urls.spotify}" target="_blank">🔗 Nghe trên Spotify</a><br>
          <button onclick="generateQRCode('${track.external_urls.spotify}')">📱 Tạo QR Code</button>
        </div>
      `;
  
      resultContainer.appendChild(div);
    });
  }  


function checkSpotifyLogin() {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_expires_at");
    const countdownElement = document.getElementById("token-expiry");

    if (token && expiresAt) {
        const timeLeft = Math.max(0, expiresAt - Date.now());
        if (timeLeft > 0) {
            document.getElementById("spotify-login-btn").style.display = "none";
            document.getElementById("spotify-logout-btn").style.display = "block";
            updateCountdown(timeLeft);
            return;
        }
    }
    
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_expires_at");
    document.getElementById("spotify-login-btn").style.display = "block";
    document.getElementById("spotify-logout-btn").style.display = "none";
    countdownElement.textContent = "Token đã hết hạn.";
}

function updateCountdown(timeLeft) {
    const countdownElement = document.getElementById("token-expiry");

    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes} phút ${seconds} giây`;
    }

    function update() {
        const remaining = Math.max(0, localStorage.getItem("spotify_expires_at") - Date.now());
        countdownElement.textContent = `Token hết hạn sau: ${formatTime(remaining)}`;
        if (remaining <= 0) {
            logoutSpotify();
        } else {
            setTimeout(update, 1000);
        }
    }

    update();
}

function logoutSpotify() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_expires_at");
    alert("Bạn đã đăng xuất Spotify!");
    checkSpotifyLogin();
}

window.onload = checkSpotifyLogin;

function saveSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem("search_history")) || [];
    if (!history.includes(query)) {
        history.unshift(query); // Thêm vào đầu danh sách
        if (history.length > 5) history.pop(); // Giữ tối đa 5 kết quả
        localStorage.setItem("search_history", JSON.stringify(history));
    }
    loadSearchHistory();
}

function loadSearchHistory() {
    const historyContainer = document.getElementById("searchHistory");
    const history = JSON.parse(localStorage.getItem("search_history")) || [];
    historyContainer.innerHTML = history.map(song => `<li>${song}</li>`).join("");
}

window.onload = () => {
    checkSpotifyLogin();
    loadSearchHistory();
};


function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (accessToken) {
        localStorage.setItem("spotify_access_token", accessToken);
        localStorage.setItem("spotify_expires_at", Date.now() + expiresIn * 1000);
        window.location.href = "index.html"; // Chuyển về trang chính sau khi lấy token
    }
}

// Nếu đang ở trang callback, lấy token từ URL
if (window.location.pathname.includes("spotifycallback.html")) {
    getAccessTokenFromUrl();
}

function clearSearchHistory() {
    localStorage.removeItem("search_history");
    loadSearchHistory();
}

function shareSong(url) {
    navigator.clipboard.writeText(url).then(() => {
      alert("✅ Đã sao chép link bài hát!");
    }).catch(() => {
      alert("❌ Không thể sao chép link.");
    });
  }  

function generateQRCode(songUrl) {
    const qrContainer = document.getElementById("qrCodeContainer");
    qrContainer.innerHTML = ""; // Xóa QR cũ
  
    if (!songUrl) {
      alert("Không tìm thấy link bài hát!");
      return;
    }
  
    const canvas = document.createElement("canvas");
    qrContainer.appendChild(canvas);
  
    QRCode.toCanvas(canvas, songUrl, { width: 180 }, function (error) {
      if (error) {
        console.error(error);
        alert("Không thể tạo mã QR!");
      }
    });
  }
  

window.searchSong = searchSong;