const CURRENT_USER_KEY = "currentUser";

function getCurrentUser() {
  return (
    localStorage.getItem(CURRENT_USER_KEY) ||
    sessionStorage.getItem(CURRENT_USER_KEY)
  );
}

function setCurrentUser(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
  sessionStorage.setItem(CURRENT_USER_KEY, username);
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  const cogBtn = document.getElementById("cog");
  const loggedInSection = document.getElementById("logged-in");
  const notLoggedInSection = document.getElementById("not-logged-in");
  const uploadIcon = document.getElementById("upload-icon");
  // logout
  const logoutIcon = document.getElementById("logout");
  logoutIcon.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
      sessionStorage.removeItem("currentUser");
      window.location.href = "../Log/form.html";
    }
  });

  if (currentUser) {
    loggedInSection.style.display = "flex";
    cogBtn.style.display = "block";
    uploadIcon.style.display = "block";
    notLoggedInSection.style.display = "none";
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (userData) {
      // Update username
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = currentUser;

      // Update avatar
      const userAvatar = document.getElementById("userAvatar");
      userAvatar.src = userData.avatar || "default-avatar.png";
    }
  } else {
    // Chưa đăng nhập: hiển thị biểu tượng user
    logoutIcon.style.display = "none";
    cogBtn.style.display = "none";
    uploadIcon.style.display = "none";
    loggedInSection.style.display = "none";
    notLoggedInSection.style.display = "block";
  }

  // Thêm thuộc tính title và alt cho danh sách bài hát
  const items = document.querySelectorAll(".music-list .items .item");
  items.forEach((item) => {
    const songTitleElement = item.querySelector(".details h5");
    const artistElement = item.querySelector(".details p");

    if (songTitleElement) {
      const songTitle = songTitleElement.textContent.trim();
      songTitleElement.setAttribute("title", songTitle);
      songTitleElement.setAttribute("alt", songTitle);
    }

    if (artistElement) {
      const artist = artistElement.textContent.trim();
      artistElement.setAttribute("title", artist);
      artistElement.setAttribute("alt", artist);
    }
  });
});

//Chuyển hướng khi nhấp vào biểu tượng user
const loginIcon = document.getElementById("login-icon");
loginIcon.addEventListener("click", () => {
  window.location.href = "../Log/form.html";
});

// Khai báo biến toàn cục
let player;
let progressInterval;
let currentSongIndex = 0;
let currentVideoId;
let alarmTimeout;
let alarmInterval;
let repeatMode = "none";
let shuffleMode = false;
let shuffleHistory = [];

const songs = [
  {
    title: "Falls In Luv",
    artist: "Côngg",
    videoId: "GgKhuJ-Qx_I",
    imageUrl:
      "https://i.pinimg.com/736x/3a/c5/ba/3ac5ba444aafa87100ce41e8093bac0b.jpg",
    duration: "01:41",
    codesngs: "00110",
    public: true,
  },
  {
    title: "Già Cùng Nhau Là Được",
    artist: "Tùng TeA x PC",
    videoId: "giQDMzYJW_c",
    imageUrl:
      "https://i.pinimg.com/564x/7b/fc/ad/7bfcad8c89a28f48e383b8f0361bb5f8.jpg",
    duration: "03:51",
    codesngs: "00210",
    public: true,
  },
  {
    title: "Medusa",
    artist: "One ft. Ken & Tloo",
    videoId: "Mp4zim9lc0s",
    imageUrl:
      "https://i.pinimg.com/564x/a6/0a/aa/a60aaaa48e4b69fe9af18a6bcfc4f0f0.jpg",
    duration: "03:18",
    codesngs: "00310",
    public: true,
  },
  {
    title: "Rain in 7",
    artist: "Lil Shady ft. Ogenus, Zenky & N'Small",
    videoId: "Lky60WNXOro",
    imageUrl:
      "https://i.pinimg.com/564x/f6/05/d6/f605d6ffd205409ecd71379017fe078f.jpg",
    duration: "04:22",
    codesngs: "00410",
    public: true,
  },
  {
    title: "Quên Em Thật Mau",
    artist: "LilHoangThien",
    videoId: "qzGBzGJRikQ",
    imageUrl:
      "https://i.pinimg.com/736x/c5/e2/03/c5e203e5653990c410a6717a63a8ef4c.jpg",
    duration: "05:07",
    codesngs: "00510",
    public: true,
  },
  {
    title: "Chặng Cuối Thu",
    artist: "Vân Anh ft. Thanh",
    videoId: "Zw0mwaAKqHo",
    imageUrl:
      "https://i.pinimg.com/564x/d6/99/a6/d699a65785f132e035539abf5b3d440f.jpg",
    duration: "03:04",
    codesngs: "00610",
    public: true,
  },
  {
    title: "Phai",
    artist: "Rocky CDE ft. Chie",
    videoId: "SD_pXPecIL4",
    imageUrl:
      "https://i.pinimg.com/736x/6e/60/69/6e6069b84ad7f3d5b42074584a8a46e8.jpg",
    duration: "03:34",
    codesngs: "00710",
    public: true,
  },
];

const hiddenSongs = [
  {
    title: "Tháng 6",
    artist: "NamS Hip Hop",
    videoId: "gY_a76yp6Tw",
    imageUrl:
      "https://wallpaperwaifu.com/wp-content/uploads/2023/06/eru-chitanda-hyouka-thumb.jpg",
    duration: "02:25",
    codesngs: "00810",
    public: true,
  },
  {
    title: "Em Ơi Em Như Con Rồng Xanh",
    artist: "$A Lil Van ft. Icy Famou$",
    videoId: "tC0KHPKsZ68",
    imageUrl:
      "https://i.pinimg.com/736x/68/d4/a2/68d4a2b53a5bdf2003e82316c74d0138.jpg",
    duration: "03:32",
    codesngs: "00910",
    public: true,
  },
  {
    title: "Sang Và Khó Tính",
    artist: "$A Lil Van ft. Icy Famou$",
    videoId: "HxCBsKPJ4ao",
    imageUrl:
      "https://i.pinimg.com/736x/d1/af/78/d1af7827ab96dba7e58af6ef27545129.jpg",
    duration: "03:34",
    codesngs: "01010",
    public: true,
  },
  {
    title: "Cota",
    artist: "Gnob",
    videoId: "21bYtRCXRJE",
    imageUrl:
      "https://i.pinimg.com/736x/69/c7/2d/69c72d7d402a200d2e5c84dee0bb176e.jpg",
    duration: "03:02",
    codesngs: "01110",
    public: true,
  },
  {
    title: "Lối Xưa",
    artist: "Dakey",
    videoId: "fqx8o3wV3_k",
    imageUrl:
      "https://i.pinimg.com/736x/9c/47/ef/9c47efb3a0e8f42d4d08e61f26125bf1.jpg",
    duration: "02:06",
    codesngs: "01210",
    public: true,
  },
  {
    title: "Cắt kéo trên Lênin",
    artist: "Low G",
    videoId: "u933bUFjV80",
    imageUrl:
      "https://i.pinimg.com/736x/da/a3/9a/daa39af1b43ab364689c89ec9f99740f.jpg",
    duration: "04:39",
    codesngs: "01310",
    public: true,
  },
  {
    title: "Đi Qua Hoa Cúc",
    artist: "TeA ft. VoVanDuc",
    videoId: "PdYkq4AMYkM",
    imageUrl:
      "https://i.pinimg.com/736x/8b/f5/da/8bf5da6ad29c43fba81fd934b5219cb5.jpg",
    duration: "04:09",
    codesngs: "01410",
    public: true,
  },
  {
    title: "Hoa Bằng Lăng",
    artist: "Kidz",
    videoId: "Z4Dn5-vqBxI",
    imageUrl:
      "https://i.pinimg.com/736x/dc/48/8b/dc488b7911f41fc09a6add0db60a836d.jpg",
    duration: "02:37",
    codesngs: "01510",
    public: true,
  },
];

const codeSongs = [
  {
    title: "Trương Đình Hoàng",
    artist: "$A Lil Van",
    videoId: "P3-t8jkNSJM",
    imageUrl:
      "https://i.pinimg.com/736x/7d/79/d5/7d79d5ca93d05bbb27139cc4e5d2126a.jpg",
    duration: "03:39",
    codesngs: "01610",
  },
  {
    title: "Tháng 12 Anh Có",
    artist: "Kidz",
    videoId: "rgarrm774-0",
    imageUrl:
      "https://i.pinimg.com/736x/54/74/e1/5474e13c0c11e38de4621cc412366d90.jpg",
    duration: "01:39",
    codesngs: "01710",
  },
  {
    title: "247 Cuộc Gọi Người Lắng Nghe",
    artist: "Kidz",
    videoId: "FqZQluIMVgw",
    imageUrl:
      "https://i.pinimg.com/736x/2b/de/d0/2bded0bab2780cf579458d957b7572b1.jpg",
    duration: "01:50",
    codesngs: "01810",
  },
  {
    title: "Dạy Anh Cách Iu",
    artist: "Anzz ft. Ultimit",
    videoId: "IgPj-bOdd3c",
    imageUrl:
      "https://i.pinimg.com/736x/1d/7c/3a/1d7c3a37c56b586d68d7d6682b0fbc52.jpg",
    duration: "03:08",
    codesngs: "01910",
  },
  {
    title: "Yêu Lại Chút Thôi",
    artist: "Clow x Linh Thộn",
    videoId: "oHc5xjM4bA4",
    imageUrl:
      "https://i.pinimg.com/736x/46/aa/f0/46aaf0bf2bb8004001656ede0b47a22a.jpg",
    duration: "03:53",
    codesngs: "02010",
  },
  {
    title: "Vương Vấn",
    artist: "Côngg ft. Clow",
    videoId: "YbRaNl4TONo",
    imageUrl:
      "https://i.pinimg.com/736x/ed/fb/24/edfb249835a0cd785fd651ef3b35cc03.jpg",
    duration: "04:07",
    codesngs: "02110",
  },
  {
    title: "Chờ Thì Vẫn Chờ",
    artist: "D$Cee",
    videoId: "S6Okrd7GESY",
    imageUrl:
      "https://i.pinimg.com/736x/f1/12/db/f112db0d99245799f43196acb6f4b234.jpg",
    duration: "03:01",
    codesngs: "02210",
  },
  {
    title: "Mơ",
    artist: "D$Cee",
    videoId: "LzdLqmWScBM",
    imageUrl:
      "https://i.pinimg.com/736x/c7/99/54/c79954a1141d28b542f8fa7d8b34f925.jpg",
    duration: "02:00",
    codesngs: "02310",
  },
  {
    title: "Anh Không Hiểu",
    artist: "Godthic ft. Namchan",
    videoId: "CztzFQiGLR0",
    imageUrl:
      "https://i.pinimg.com/736x/28/76/9e/28769ef1442a2ba06379e5db0ee77e7d.jpg",
    duration: "03:57",
    codesngs: "02410",
  },
  {
    title: "Hướng Dương",
    artist: "Godthic",
    videoId: "J7RtzGo_8dc",
    imageUrl:
      "https://i.pinimg.com/736x/a8/0d/68/a80d68fa214ddcb95984d38a55a4c6b5.jpg",
    duration: "03:13",
    codesngs: "02510",
  },
  {
    title: "Sunset",
    artist: "Ronboogz",
    videoId: "PN6c2zX6avI",
    imageUrl:
      "https://i.pinimg.com/736x/71/ef/00/71ef008ea042b5ac41a29213c7216b47.jpg",
    duration: "03:04",
    codesngs: "02610",
  },
  {
    title: "Tham Phú Phụ Hồ",
    artist: "Kejo ft. Yuri, Griseo",
    videoId: "4PzT7yqUGK0",
    imageUrl:
      "https://i.pinimg.com/736x/15/03/73/15037324aaa0231e27d629da46259c39.jpg",
    duration: "03:06",
    codesngs: "02710",
  },
  {
    title: "Nostalgia",
    artist: "Godthic",
    videoId: "KDThNBO0vgw",
    imageUrl:
      "https://i.pinimg.com/736x/95/19/50/951950a4eae036a17ed927896f908345.jpg",
    duration: "03:05",
    codesngs: "02810",
  },
  {
    title: "Và Em Ơi",
    artist: "Ccmk",
    videoId: "SjYDp7lQmfY",
    imageUrl:
      "https://i.pinimg.com/736x/ee/42/17/ee4217650fbc5084061048019aa58e2f.jpg",
    duration: "03:21",
    codesngs: "02910",
  },
  {
    title: "Chuyện Buồn Vui",
    artist: "The Night ft. ZinNine",
    videoId: "rLhBGHQGuq4",
    imageUrl:
      "https://i.pinimg.com/736x/6b/0a/5f/6b0a5fb60e6bf89905dcb36c93fbeab5.jpg",
    duration: "03:23",
    codesngs: "03010",
  },
  {
    title: "Bỏ Ngỏ",
    artist: "Minggg ft. Trần Thế Thôi",
    videoId: "SkPkGmVTi6Q",
    imageUrl:
      "https://i.pinimg.com/736x/64/19/1e/64191ef7fcf1c78a19b80ff2cca1dd38.jpg",
    duration: "04:23",
    codesngs: "03110",
  },
  {
    title: "Mắt Biếc",
    artist: "TeA ft. PC",
    videoId: "QDY4Gy_4eYw",
    imageUrl:
      "https://i.pinimg.com/736x/00/07/b6/0007b60fc6b1f60320d013f559dd2031.jpg",
    duration: "03:46",
    codesngs: "03210",
  },
  {
    title: "Như Ngày Đó",
    artist: "Binz ft. Khói, It's Lee",
    videoId: "LxaU644C3is",
    imageUrl:
      "https://i.pinimg.com/736x/bd/c6/d1/bdc6d15d541ff22320ec5a1f16a948fa.jpg",
    duration: "04:26",
    codesngs: "03310",
  },
  {
    title: "Ngọt Như Ly Soda",
    artist: "Nmọc ft. Notcool",
    videoId: "3oJt9mY8m_M",
    imageUrl:
      "https://i.pinimg.com/736x/90/4e/6c/904e6c3899a0fc979149e1aa9abf4ed1.jpg",
    duration: "01:09",
    codesngs: "03410",
  },
  {
    title: "Đô-Ki",
    artist: "Xính Phao ft. Sáng",
    videoId: "KsztP1sF35o",
    imageUrl:
      "https://i.pinimg.com/736x/79/81/65/798165c105b3d44b890202a69f64b877.jpg",
    duration: "02:08",
    codesngs: "03510",
  },
  {
    title: "Những Ô Cửa Màu",
    artist: "ToFu ft. VoVanDuc",
    videoId: "PKYbWjV51IY",
    imageUrl:
      "https://i.pinimg.com/736x/ca/07/89/ca07891bcd3be6e450a6ae079b28b13b.jpg",
    duration: "04:06",
    codesngs: "03610",
  },
  {
    title: "Anh Muốn Nhìn Thấy Em",
    artist: "The Wind ft. Dangrangto",
    videoId: "U5B4IKKjkJA",
    imageUrl:
      "https://i.pinimg.com/736x/c2/af/53/c2af537f143081323974032c4f43c886.jpg",
    duration: "03:32",
    codesngs: "03710",
  },
  {
    title: "Nokia",
    artist: "Left Hand ft. V#",
    videoId: "S8hFnd4k1FU",
    imageUrl:
      "https://i.pinimg.com/736x/c4/70/25/c470255d0244a103b8c9f431eaff11cc.jpg",
    duration: "04:54",
    codesngs: "03810",
  },
  {
    title: "Last Night",
    artist: "Hazel ft. Left Hand",
    videoId: "64JksYSh4q0",
    imageUrl:
      "https://i.pinimg.com/736x/5f/1d/86/5f1d8684dbbe99ee1c7c45044710e1d3.jpg",
    duration: "03:27",
    codesngs: "03910",
  },
  {
    title: "Bất An",
    artist: "Anzz",
    videoId: "TE_yy4_Uvvg",
    imageUrl:
      "https://i.pinimg.com/736x/74/f0/d7/74f0d72871a1a7b5a67010e499c70421.jpg",
    duration: "03:30",
    codesngs: "04010",
  },
  {
    title: "Phi Tiêu",
    artist: "Left Hand",
    videoId: "5ySkmrU9deY",
    imageUrl:
      "https://i.pinimg.com/736x/b3/b8/59/b3b859b9c1de70b671136b99c17163ae.jpg",
    duration: "03:40",
    codesngs: "04110",
  },
  {
    title: "Thành Phố Đón Mưa Về",
    artist: "Urabe ft. PC",
    videoId: "C3TGUP6jmK0",
    imageUrl:
      "https://i.pinimg.com/736x/29/1b/15/291b15a9aa2f760674e52338cac04e4b.jpg",
    duration: "02:29",
    codesngs: "04210",
  },
  {
    title: "Anh Không Thề Gì Đâu Anh Làm",
    artist: "Phúc Du",
    videoId: "me0a3KSvEnI",
    imageUrl:
      "https://i.pinimg.com/736x/aa/3a/93/aa3a93ebd809b87b6f39a3aae8c85617.jpg",
    duration: "02:10",
    codesngs: "04310",
  },
  {
    title: "Độc Tấu",
    artist: "Hades ft. Yamix Hầu Ca",
    videoId: "tKAs4NB5WBo",
    imageUrl:
      "https://i.pinimg.com/736x/15/e0/a8/15e0a8ba89c38faee2342531d61b960a.jpg",
    duration: "05:17",
    codesngs: "04410",
  },
  {
    title: "Cây Trường Xuân",
    artist: "Chị Cả",
    videoId: "4msvp_FU5aU",
    imageUrl:
      "https://i.pinimg.com/736x/4e/bf/b6/4ebfb61e1808b49f2293d9498f6a7807.jpg",
    duration: "03:05",
    codesngs: "04510",
  },
  {
    title: "Lãng Du",
    artist: "ToFu ft. An",
    videoId: "ZXhXlffz_60",
    imageUrl:
      "https://i.pinimg.com/736x/aa/90/3c/aa903c66c502601026030398f018490d.jpg",
    duration: "03:33",
    codesngs: "04610",
  },
  {
    title: "Qua Những Tiếng Ve",
    artist: "ToFu ft. Xesi, Urabe",
    videoId: "2L32VYBW6C4",
    imageUrl:
      "https://i.pinimg.com/736x/bf/86/6d/bf866d306ba54bc530313d8e2b2b1a6c.jpg",
    duration: "04:06",
    codesngs: "04710",
  },
  {
    title: "Hương Rừng",
    artist: "TeA ft. Mr Shyn",
    videoId: "Fxv2yil_oP0",
    imageUrl:
      "https://i.pinimg.com/736x/ac/31/ed/ac31edc0a2d565370ef99a6653a6d7bc.jpg",
    duration: "03:02",
    codesngs: "04810",
  },
  {
    title: "La Beaute de Saigon",
    artist: "Lux ft. Duckie, Phát",
    videoId: "0Dl-j_yRtrQ",
    imageUrl:
      "https://i.pinimg.com/736x/4e/f8/03/4ef8034a840c0c18cd0f044d0dd11dc9.jpg",
    duration: "03:50",
    codesngs: "04910",
  },
  {
    title: "Tiểu Thuyết Tình Yêu",
    artist: "Lee7 ft. Andree, It's Lee",
    videoId: "JA5odWBtUjs",
    imageUrl:
      "https://i.pinimg.com/736x/2c/9e/d8/2c9ed8d61958fa3e00160a8fa755df54.jpg",
    duration: "03:18",
    codesngs: "05010",
  },
  {
    title: "Công Chú Và Phù Thuỷ",
    artist: "DVD the MC",
    videoId: "Q4cwD-Lk25A",
    imageUrl:
      "https://i.pinimg.com/736x/42/ac/12/42ac125cf79920bd7f8064489e21538a.jpg",
    duration: "01:39",
    codesngs: "05110",
  },
  {
    title: "Chỉ Là Quá Khứ",
    artist: "$eadreak ft Young Crizzbe",
    videoId: "QM6GFnePmAw",
    imageUrl:
      "https://i.pinimg.com/736x/07/ef/27/07ef277a374bb35a62f944439680c436.jpg",
    duration: "04:43",
    codesngs: "05210",
  },
  {
    title: "Trước Khi Ta Xa",
    artist: "Namlee ft. 1nG",
    videoId: "q-XiLY3FwW8",
    imageUrl:
      "https://i.pinimg.com/736x/8a/47/ab/8a47ab3e5f987c806279bcf99b75dfa6.jpg",
    duration: "02:11",
    codesngs: "05310",
  },
  {
    title: "Sóng",
    artist: "Rush",
    videoId: "SOFZbN8pJ2Y",
    imageUrl:
      "https://i.pinimg.com/736x/ff/21/63/ff21632374aae3a6cd1ea26fbd5158f7.jpg",
    duration: "04:00",
    codesngs: "05410",
  },
  {
    title: "Hương Dã Quỳ",
    artist: "Luxi, Lonewolf",
    videoId: "TvEr7_L-YuQ",
    imageUrl:
      "https://i.pinimg.com/736x/ae/d9/8a/aed98a9742ed15d64d449dd5ba29a708.jpg",
    duration: "02:36",
    codesngs: "05510",
  },
  {
    title: "Điện Thoại, Biển Cả & Tôi",
    artist: "ZB ft. Ami",
    videoId: "-NpHc_UamAg",
    imageUrl:
      "https://i.pinimg.com/736x/a2/08/70/a20870c12dbfd894116b655f3ad49db4.jpg",
    duration: "04:19",
    codesngs: "05610",
  },
  {
    title: "Không Sợ Em Nữa",
    artist: "DVD the MC ft. Krip & Pop D",
    videoId: "kRbI-mrglr8",
    imageUrl:
      "https://i.pinimg.com/736x/64/a7/9a/64a79ad25ff5ccbb469bbc4dc8f04f6e.jpg",
    duration: "03:18",
    codesngs: "05710",
  },
  {
    title: "Thu Tháng Mười",
    artist: "Mr. Cười ft. Mose",
    videoId: "CkclnN5A8Ms",
    imageUrl:
      "https://i.pinimg.com/736x/aa/f0/ad/aaf0add5fd374e0f3b781229193badfc.jpg",
    duration: "02:48",
    codesngs: "05810",
  },
  {
    title: "Về Một Nơi",
    artist: "cRazilit",
    videoId: "66x-bTmpSt4",
    imageUrl:
      "https://i.pinimg.com/474x/59/fa/41/59fa41347e6379fa68ee9cee48cf95e3.jpg",
    duration: "02:32",
    codesngs: "05910",
  },
  {
    title: "HongKong 12",
    artist: "Nguyễn Trọng Tài ft. MC 12",
    videoId: "eEQn8jfkyUM",
    imageUrl:
      "https://i.pinimg.com/736x/3a/5b/47/3a5b47963edf809a3eb4bfa9ca7583ef.jpg",
    duration: "04:33",
    codesngs: "06010",
  },
  {
    title: "Đồi Hoa Mặt Trời",
    artist: "Ecc",
    videoId: "lou10TjRTlA",
    imageUrl:
      "https://i.pinimg.com/736x/ee/d3/06/eed30616a526fdd6308692233b27e9f3.jpg",
    duration: "02:00",
    codesngs: "06110",
  },
  {
    title: "Missing Is A Type Of Illness",
    artist: "Quất Điền",
    videoId: "OW7s0BQY464",
    imageUrl:
      "https://i.pinimg.com/736x/44/ff/0a/44ff0a7ef6db6e608dd4e94216196c79.jpg",
    duration: "03:15",
    codesngs: "06210",
  },
  {
    title: "C'est La Vie",
    artist: "Quất Điền",
    videoId: "GbccI-dveRA",
    imageUrl:
      "https://i.pinimg.com/736x/7f/fa/20/7ffa20e42711cc3bf7e7e8f03cbb8feb.jpg",
    duration: "03:11",
    codesngs: "06310",
  },
  {
    title: "Về",
    artist: "Roces",
    videoId: "NCtoCmcQez8",
    imageUrl:
      "https://i.pinimg.com/736x/7b/c3/12/7bc31265b1dbffbcce0f00fe2eb5e243.jpg",
    duration: "02:04",
    codesngs: "06410",
  },
  {
    title: "479 Days in a Nutshell",
    artist: "2T",
    videoId: "Q3nbWfWDQyY",
    imageUrl:
      "https://i.pinimg.com/736x/ea/33/5b/ea335b6c0a52a53c8e3affd14f5f9dda.jpg",
    duration: "02:08",
    codesngs: "06510",
  },
  {
    title: "Và Là Em",
    artist: "Ecc",
    videoId: "9rFB-5ZdOk8",
    imageUrl:
      "https://i.pinimg.com/736x/9c/3f/6c/9c3f6c858b3c2b407a205ca62d9cf6ed.jpg",
    duration: "03:59",
    codesngs: "06610",
  },
  {
    title: "Hương Tràm",
    artist: "Hazel ft. Hanel",
    videoId: "S72jnc9ZxUM",
    imageUrl:
      "https://i.pinimg.com/736x/67/32/fb/6732fbbb7b34487feb823a64c00f2f5e.jpg",
    duration: "03:14",
    codesngs: "06710",
  },
  {
    title: "Khi Ánh Hào Quang Dần Khuất",
    artist: "Hoàng Đảo Chủ",
    videoId: "qIoXfeTWPkI",
    imageUrl:
      "https://i.pinimg.com/736x/cd/96/bf/cd96bfc2b090232d2f79d5a06d643dec.jpg",
    duration: "04:16",
    codesngs: "06810",
  },
  {
    title: "Em Có",
    artist: "Quất Điền",
    videoId: "my3qsnPzj8k",
    imageUrl:
      "https://i.pinimg.com/736x/1d/69/44/1d6944eece1818990e6322e544e9beb3.jpg",
    duration: "02:55",
    codesngs: "06910",
  },
  {
    title: "Có Bông Tuyết Nào Rơi",
    artist: "Quất Điền",
    videoId: "G5VHTvpwrvc",
    imageUrl:
      "https://i.pinimg.com/736x/ed/b8/01/edb80161e9a36e49b65b6b450b6f001a.jpg",
    duration: "03:32",
    codesngs: "07010",
  },
  {
    title: "f l o w e r",
    artist: "Dvd ft. Trí Dũng",
    videoId: "xwgJ6H-oHfA",
    imageUrl:
      "https://i.pinimg.com/736x/ae/a2/a4/aea2a4b325310be44dbf95429ee65493.jpg",
    duration: "02:47",
    codesngs: "07110",
  },
  {
    title: "Forget Me Now",
    artist: "Fishy, Trí Dũng",
    videoId: "NngRD9ZDDDU",
    imageUrl:
      "https://i.pinimg.com/736x/e0/0f/cf/e00fcf326a08e9c81ea11fbdf12d6b65.jpg",
    duration: "03:17",
    codesngs: "07210",
  },
  {
    title: "Điều Anh Nhận Được",
    artist: "2Can ft. Tofu",
    videoId: "FKvQ9zw5B2Q",
    imageUrl:
      "https://i.pinimg.com/736x/6c/b0/04/6cb004483b894571c45445b5fd23016a.jpg",
    duration: "03:22",
    codesngs: "07310",
  },
  {
    title: "Sài Gòn Không Em",
    artist: "Dakey ft. Lil Miz",
    videoId: "5PkU49SYzpI",
    imageUrl:
      "https://i.pinimg.com/736x/90/93/52/909352868b474a29115d49f5a77dc8c3.jpg",
    duration: "04:50",
    codesngs: "07410",
  },
  {
    title: "Thằng Khốn Nào Làm Em Buồn",
    artist: "LunTun",
    videoId: "eiEkWlE8pWA",
    imageUrl:
      "https://i.pinimg.com/736x/16/a3/92/16a392c6a1c6b1f70371ffddb368425d.jpg",
    duration: "02:11",
    codesngs: "07510",
  },
  {
    title: "Yêu Đơn Phương",
    artist: "Dvd the MC",
    videoId: "0hWq5h34Y9w",
    imageUrl:
      "https://i.pinimg.com/736x/47/40/6e/47406e6d956c6dc6b9ef52978d217276.jpg",
    duration: "02:26",
    codesngs: "07610",
  },
  {
    title: "Nắng Ở Góc Phố",
    artist: "ICD x B.doublei",
    videoId: "dYKJco8ZW30",
    imageUrl:
      "https://i.pinimg.com/736x/09/09/ec/0909eca28da2d86212e37e67ccfc7caf.jpg",
    duration: "02:55",
    codesngs: "07710",
  },
  {
    title: "Chỉ Là Cái Cớ Của Anh",
    artist: "Mad'L, Whitey",
    videoId: "mSZt5A6FrFw",
    imageUrl:
      "https://i.pinimg.com/736x/aa/e9/6b/aae96b5eb4ae062cfdd38da0becfce30.jpg",
    duration: "02:46",
    codesngs: "07810",
  },
  {
    title: "Cafe",
    artist: "Urabe X PC X Vovanduc",
    videoId: "J2QJ2P8zlH8",
    imageUrl:
      "https://i.pinimg.com/736x/f5/9a/52/f59a5207a4a8d21dea2bddfd79145c80.jpg",
    duration: "03:27",
    codesngs: "07910",
  },
  {
    title: "Tát Nước Đầu Đình",
    artist: "Binz ft. Lynk Lee",
    videoId: "t_urxwCgqm8",
    imageUrl:
      "https://i.pinimg.com/736x/94/06/b3/9406b3f98bd2669853c2feb5b930c4ec.jpg",
    duration: "04:03",
    codesngs: "08010",
  },
  {
    title: "The Last Rain",
    artist: "NamNori x Shifu",
    videoId: "iJY-mJ3ObKE",
    imageUrl:
      "https://i.pinimg.com/736x/f5/14/bf/f514bf72a14219cd1f6b7abffc74fdbc.jpg",
    duration: "04:42",
    codesngs: "08110",
  },
  {
    title: "Phố Nhỏ",
    artist: "MC ILL ft. Thu Giang",
    videoId: "0bW91VMdv1s",
    imageUrl:
      "https://i.pinimg.com/736x/c0/03/28/c003285f66f5e2ee69da41b62d33e632.jpg",
    duration: "03:32",
    codesngs: "08210",
  },
  {
    title: "Blue Tequila",
    artist: "Táo",
    videoId: "hTGcMk_QXEg",
    imageUrl:
      "https://i.pinimg.com/736x/92/f1/a1/92f1a1cf2bb5c4857f96b46b5c28c4ae.jpg",
    duration: "04:21",
    codesngs: "08310",
  },
  {
    title: "Tâm Sự Riêng",
    artist: "NamLee ft. PCGL",
    videoId: "fo9tV0UmUMo",
    imageUrl:
      "https://i.pinimg.com/736x/25/27/5b/25275b66a965ac9620f8234c491f9e54.jpg",
    duration: "05:06",
    codesngs: "08410",
  },
  {
    title: "Phố Chiều Thu",
    artist: "Tungdreamer ft. Rubidi, V Eilis",
    videoId: "z2ycKOoplqY",
    imageUrl:
      "https://i.pinimg.com/736x/e8/87/dc/e887dc836393a83c328828ec517f20fc.jpg",
    duration: "03:43",
    codesngs: "08510",
  },
  {
    title: "Người Bất An",
    artist: "Ultimít",
    videoId: "Ze0GJuL096o",
    imageUrl:
      "https://i.pinimg.com/736x/62/51/a8/6251a8b3c7ca1bf563224715ebbd5f1d.jpg",
    duration: "04:05",
    codesngs: "08610",
  },
  {
    title: "Cô Gái Này Là Của Ai",
    artist: "Krix, Rush ft. Nhi Nhi",
    videoId: "44c7BxTfL44",
    imageUrl:
      "https://i.pinimg.com/736x/a2/e7/03/a2e703a0a74b039e3f195b3a64913bb0.jpg",
    duration: "03:00",
    codesngs: "08710",
  },
  {
    title: "Nói Em Nghe Địa Ngục & Phát Ơi Tự Lo",
    artist: "Cậu Phát",
    videoId: "H_8L7g9zt6k",
    imageUrl:
      "https://i.pinimg.com/736x/3c/4c/49/3c4c49fd34200b1bd6bd7d89315c4a69.jpg",
    duration: "05:54",
    codesngs: "08810",
  },
  {
    title: "6 Feet Deep",
    artist: "Xonic & Yello $osa",
    videoId: "v633GlQklH4",
    imageUrl:
      "https://i.pinimg.com/736x/26/e5/46/26e54607ff0aedb1dfdc2dcd77822faa.jpg",
    duration: "03:17",
    codesngs: "08910",
  },
  {
    title: "Anh",
    artist: "Hazel",
    videoId: "gPV83dua4Uk",
    imageUrl:
      "https://i.pinimg.com/736x/3e/fc/65/3efc65cdfa47690cbc921bdc5a9e236d.jpg",
    duration: "02:50",
    codesngs: "09010",
  },
  {
    title: "Em Thích",
    artist: "Seanpoet ft. Lửa",
    videoId: "WDA7OIXXW1U",
    imageUrl:
      "https://i.pinimg.com/736x/f6/94/53/f69453f9484986ff5cd1c7f1b49632e4.jpg",
    duration: "02:59",
    codesngs: "09110",
  },
  {
    title: "Mưa Drill Vào Phòng",
    artist: "Htingale",
    videoId: "dCwHNyPwC64",
    imageUrl:
      "https://i.pinimg.com/736x/9c/2a/43/9c2a4331d6f45ecb594429c6d96c52dd.jpg",
    duration: "02:55",
    codesngs: "09210",
  },
  {
    title: "Lính Mà",
    artist: "Cậu Phát",
    videoId: "2vOiUCoIIbg",
    imageUrl:
      "https://i.pinimg.com/736x/0c/c5/79/0cc579ae34ec4a4ec52767c0e9f31cd0.jpg",
    duration: "02:29",
    codesngs: "09310",
  },
  {
    title: "Quỳnh",
    artist: "Quất Điền",
    videoId: "EN4gxlnqPcU",
    imageUrl:
      "https://i.pinimg.com/736x/fd/b9/a7/fdb9a706773e61902e1b8e0ed26aca67.jpg",
    duration: "02:59",
    codesngs: "09410",
  },
  {
    title: "Xanh",
    artist: "MC12 ft. 2Can",
    videoId: "SLX3JFcoY7g",
    imageUrl:
      "https://i.pinimg.com/736x/f5/60/6f/f5606fee9f419759692f624eb17421d0.jpg",
    duration: "03:19",
    codesngs: "09510",
  },
  {
    title: "Ngoài Trời Có Sao",
    artist: "ToFu ft. PC",
    videoId: "2YCXYNUDSc4",
    imageUrl:
      "https://i.pinimg.com/736x/35/cc/29/35cc297a6fcdd49dca83b2e56248a510.jpg",
    duration: "04:13",
    codesngs: "09610",
  },
  {
    title: "Cổ Điển",
    artist: "ToFu ft. VoVanDuc",
    videoId: "NWvYZT-HU54",
    imageUrl:
      "https://i.pinimg.com/736x/a9/d0/3c/a9d03c220a076868be59e45163eca407.jpg",
    duration: "03:04",
    codesngs: "09710",
  },
  {
    title: "Dừng Chân Đứng Lại",
    artist: "Namlee ft. An, ToFu",
    videoId: "TVNjl9DxbIw",
    imageUrl:
      "https://i.pinimg.com/736x/2f/e7/94/2fe794a2527ec6eb55fe8fedf4847538.jpg",
    duration: "03:37",
    codesngs: "09810",
  },
  {
    title: "Tíc Tắc",
    artist: "cRazilit",
    videoId: "etUhAKCtEbQ",
    imageUrl:
      "https://i.pinimg.com/736x/95/a0/8b/95a08b3d7a4f6903bf58dcb8c78cb961.jpg",
    duration: "02:52",
    codesngs: "09910",
  },
  {
    title: "Bình Thường",
    artist: "D$Cee",
    videoId: "UEze1zh2kSA",
    imageUrl:
      "https://i.pinimg.com/736x/6f/ab/80/6fab80be3f4c803ad1ff56297031512a.jpg",
    duration: "03:32",
    codesngs: "10010",
  },
  {
    title: "Chỉ Còn Ta Và Ta Giữa Trời",
    artist: "Killic ft. D.Blue",
    videoId: "SWm52ZIAxr8",
    imageUrl:
      "https://i.pinimg.com/736x/b6/f8/2b/b6f82bb877a68df08f493ade9703de87.jpg",
    duration: "03:16",
    codesngs: "10110",
  },
  {
    title: "Ck Tạch Môn Vk Ôn Đại Học",
    artist: "Ultimit",
    videoId: "9V3UPpO91Gk",
    imageUrl:
      "https://i.pinimg.com/736x/76/84/ac/7684ac7fe69cba27e259589c043ce020.jpg",
    duration: "03:46",
    codesngs: "10210",
  },
  {
    title: "Nhật Ký",
    artist: "Dlow",
    videoId: "hAa8UiBUlJE",
    imageUrl:
      "https://i.pinimg.com/736x/a1/1f/30/a11f300ad11ef3994bfbed2a342818b8.jpg",
    duration: "02:32",
    codesngs: "10310",
  },
  {
    title: "10 Ngàn Năm",
    artist: "PC",
    videoId: "2-zSSzg8i3Y",
    imageUrl:
      "https://i.pinimg.com/736x/57/82/27/5782278d9dd340bfd1493fc4a025e952.jpg",
    duration: "03:59",
    codesngs: "10410",
  },
  {
    title: "Hai Đứa Nhóc",
    artist: "Ronboogz",
    videoId: "XWexgEEBxBQ",
    imageUrl:
      "https://i.pinimg.com/736x/7b/e2/71/7be271bb7532fa28d455b97d6cb1b5e1.jpg",
    duration: "03:36",
    codesngs: "10510",
  },
  {
    title: "Don't Côi",
    artist: "RPT Orijinn x Ronboogz",
    videoId: "1dlTWaiBZDw",
    imageUrl:
      "https://i.pinimg.com/736x/71/34/63/7134636b8eab958513352d985b0e49d5.jpg",
    duration: "02:26",
    codesngs: "10610",
  },
  {
    title: "Thành Phố Đóng Băng",
    artist: "Left Hand",
    videoId: "-FxKEUl4GGA",
    imageUrl:
      "https://i.pinimg.com/736x/1d/41/4c/1d414c6ee5a56dcd502f34c3e779ac49.jpg",
    duration: "03:17",
    codesngs: "10710",
  },
  {
    title: "Không Yêu Đừng Gây Thương Nhớ",
    artist: "nmhuon ft. Godthic",
    videoId: "6UhlD8wTTHI",
    imageUrl:
      "https://i.pinimg.com/474x/fe/77/78/fe7778ff8fa3c2d2a716f6e56a42223d.jpg",
    duration: "04:39",
    codesngs: "10810",
  },
  {
    title: "Lúc Đó",
    artist: "TH2 ft. Hale",
    videoId: "3DF7-ItfiME",
    imageUrl:
      "https://i.pinimg.com/736x/a3/23/58/a323587ba83410a576f47f6e954c8838.jpg",
    duration: "03:45",
    codesngs: "10910",
  },
  {
    title: "0505",
    artist: "Keiji ft. LVP Oni",
    videoId: "cMuz74dljD8",
    imageUrl:
      "https://i.pinimg.com/736x/3f/b1/82/3fb182ec43e728856992ce3298f82ff2.jpg",
    duration: "03:43",
    codesngs: "11010",
  },
  {
    title: "10 Giây",
    artist: "DVD ft. Krip",
    videoId: "NPeWmTepkfY",
    imageUrl:
      "https://i.pinimg.com/736x/b4/39/3f/b4393f5f62753a58d5651ca192dab59a.jpg",
    duration: "02:20",
    codesngs: "11110",
  },
  {
    title: "Nghe Bài Này Đi Em",
    artist: "Specter ft. Chu & Củ Cải",
    videoId: "sLLTYb_35fI",
    imageUrl:
      "https://i.pinimg.com/736x/c7/be/f4/c7bef4132f343e994f908ba09ac3cdeb.jpg",
    duration: "04:46",
    codesngs: "11210",
  },
  {
    title: "The White Hand",
    artist: "Shinasty",
    videoId: "iHVLjSiWiBU",
    imageUrl:
      "https://i.pinimg.com/736x/5f/62/92/5f6292d5da46002afcaa9a0ca60336ba.jpg",
    duration: "04:05",
    codesngs: "11310",
  },
  {
    title: "Cái Cớ",
    artist: "Shinasty",
    videoId: "N7h11ydkamI",
    imageUrl:
      "https://i.pinimg.com/736x/12/84/c6/1284c67253b6ebaec587ea272a858c86.jpg",
    duration: "03:25",
    codesngs: "11410",
  },
  {
    title: "Mỉm Cười",
    artist: "Yb Rookie ft. Flames & Ultimit",
    videoId: "CLBUoCsJm_0",
    imageUrl:
      "https://i.pinimg.com/736x/e2/de/f6/e2def66da27fd898baaca6a9625ab479.jpg",
    duration: "02:33",
    codesngs: "11510",
  },
  {
    title: "Anh Không Buồn Ngủ",
    artist: "Hast x TanDat",
    videoId: "HHQ8CdtfeA8",
    imageUrl:
      "https://i.pinimg.com/736x/90/fd/05/90fd05cc0f4fec38e4b9db00b6e4def6.jpg",
    duration: "02:54",
    codesngs: "11610",
  },
  {
    title: "Mạn Họa",
    artist: "PC",
    videoId: "T9y3DP0aHDM",
    imageUrl:
      "https://i.pinimg.com/736x/fb/b4/37/fbb43778844c5c5d08e11c865d116df5.jpg",
    duration: "04:29",
    codesngs: "11710",
  },
  {
    title: "Nhu Gio Voi May",
    artist: "Beteka x Gió",
    videoId: "KgNLQy2fFZE",
    imageUrl:
      "https://i.pinimg.com/736x/03/99/3d/03993d5bc90a8482195c17f27bd4a3ca.jpg",
    duration: "02:57",
    codesngs: "11810",
  },
  {
    title: "Muốn Được Cùng Em",
    artist: "Freaky ft. Quỳnh Gai",
    videoId: "BZYp-6D0SDY",
    imageUrl:
      "https://i.pinimg.com/736x/2d/41/ca/2d41cae88f26d3c4b6acedcf950fe9ba.jpg",
    duration: "03:29",
    codesngs: "11910",
  },
  {
    title: "Những Dòng Tin Nhắn",
    artist: "Minh Huy ft. Pinny",
    videoId: "mw9h6THQhRM",
    imageUrl:
      "https://i.pinimg.com/736x/30/16/68/3016685c6650f8a5743f99d1ee44b404.jpg",
    duration: "04:22",
    codesngs: "12010",
  },
  {
    title: "Anh Không Buồn Như Em Nghĩ",
    artist: "Kis",
    videoId: "f0931LSBGfA",
    imageUrl:
      "https://i.pinimg.com/736x/dd/4c/1e/dd4c1e6987a8290e2b17653ea521fb7c.jpg",
    duration: "04:01",
    codesngs: "12110",
  },
  {
    title: "Em Thấm Vào Anh Chưa?",
    artist: "Ron Phan ft. Lê Hà",
    videoId: "mh38m_O3-7Q",
    imageUrl:
      "https://i.pinimg.com/736x/a4/94/35/a49435542de132a3154ed1cef9e5d655.jpg",
    duration: "03:27",
    codesngs: "12210",
  },
  {
    title: "Nói Theo 1 Cách Khác",
    artist: "Anzz",
    videoId: "OnojF3JL3Tw",
    imageUrl:
      "https://i.pinimg.com/736x/b9/7b/63/b97b63e066aeb8a98d2ca2e74299b97f.jpg",
    duration: "03:27",
    codesngs: "12310",
  },
  {
    title: "Trồng Cây Simp",
    artist: "Anzz",
    videoId: "4iGvZXsE2QY",
    imageUrl:
      "https://i.pinimg.com/736x/b7/e7/7f/b7e77f9592887100a13164a78e444468.jpg",
    duration: "02:14",
    codesngs: "12410",
  },
  {
    title: "Gọi Anh Là Gió",
    artist: "Gió",
    videoId: "QTTDzkzmE4E",
    imageUrl:
      "https://i.pinimg.com/736x/fe/34/f1/fe34f14a6b3dcbe94747fda54b78c214.jpg",
    duration: "02:03",
    codesngs: "12510",
  },
  {
    title: "Gió Ấm",
    artist: "Milly ft. Rocky CDE",
    videoId: "jlJAmTwpTDU",
    imageUrl:
      "https://i.pinimg.com/1200x/61/be/9e/61be9e9d67551b1889c83e787ea3d9bb.jpg",
    duration: "03:21",
    codesngs: "12610",
  },
  {
    title: "1mandemutoi.exe",
    artist: "kaitolit ft. Gió",
    videoId: "1aYbaGljbec",
    imageUrl:
      "https://i.pinimg.com/1200x/83/ba/04/83ba047c106b65cf3337d5b71d1582ef.jpg",
    duration: "03:32",
    codesngs: "12710",
  },
];

const genres = [
  `Electro </br> Pop`,
  `Dance </br> Beat`,
  `Clubhouse </br> Remix`,
  `Hip Hop </br> Rap`,
  `Chill </br> Lo-fi`,
  `Alternative </br> Indie`,
  `Blues </br> Soul`,
  `Cloud </br> Music`,
  `Ambient </br> Chillout`,
  `Downtempo </br> Jazz`,
];

const artists = [
  "Côngg",
  "DVD the MC",
  "Mr.Cười",
  "Mose",
  "Hades",
  "Vân Anh",
  "Thanh",
  "NamS Hip Hop",
  "Dakey",
  "TeA",
  "Kidz",
  "$a Lil Van",
  "Ronboogz",
  "Kejo",
  "Khói",
  "Binz",
  "Hazel",
  "Left Hand",
  "Xesi",
  "VoVanDuc",
  "Quất Điền",
  "Ecc",
];

// Khi YouTube API sẵn sàng
function onYouTubeIframeAPIReady() {
  const container = document.getElementById("youtube-player");

  if (container) {
    container.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen",
    );
  }

  player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: songs[currentSongIndex].videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      origin: window.location.origin,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

function onPlayerError(event) {
  console.log("Lỗi Player:", event.data);
  alert("Không thể phát bài hát này, chuyển sang bài tiếp theo.");
  nextSong();
}

// Khi player sẵn sàng
function onPlayerReady(event) {
  console.log("Player đã sẵn sàng!", event.data);

  try {
    const iframe = player.getIframe();

    if (iframe) {
      iframe.setAttribute(
        "allow",
        "autoplay; encrypted-media; picture-in-picture; fullscreen",
      );

      iframe.setAttribute("playsinline", "true");
    }
  } catch (err) {
    console.warn("Không thể cấu hình iframe YouTube:", err);
  }

  if (player && typeof player.setVolume === "function") {
    player.setVolume(currentVolume);
  }
}

if (currentSongIndex >= [...songs, ...hiddenSongs, ...codeSongs].length) {
  console.error("Chỉ số bài hát vượt quá phạm vi danh sách!");
  currentSongIndex = 0; // Đặt về bài đầu tiên nếu có lỗi
}

// Listen Now
const listenNowButton = document.querySelector(
  ".trending .left .info .buttons .listen_now",
);
listenNowButton.addEventListener("click", () => {
  currentSongIndex = 7;
  playSong([...songs, ...hiddenSongs, ...codeSongs]);
});

const initialDisplayCount = 12; // Số lượng mục hiển thị ban đầu
let currentDisplay = "genres"; // Trạng thái mặc định là genres

// Hàm render danh sách
function renderList(items, containerId, type, showAll = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Xóa nội dung cũ để tránh chồng lấn

  const displayCount = showAll ? items.length : initialDisplayCount;
  const displayItems = items.slice(0, displayCount);

  displayItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<p>${item}</p>`;
    container.appendChild(div);
  });

  // Quản lý nút "See all"
  const seeAllButton = document.getElementById("see-all-artists");
  if (showAll || items.length <= initialDisplayCount) {
    seeAllButton.textContent = "Hide";
  } else {
    seeAllButton.textContent = "See all";
  }

  // Cập nhật trạng thái hiển thị
  currentDisplay = type;
}

// Sự kiện cho nút "See all"
const seeAllButton = document.getElementById("see-all-artists");
seeAllButton.addEventListener("click", () => {
  if (currentDisplay === "genres") {
    if (seeAllButton.textContent === "See all") {
      renderList(genres, "playlist-items", "genres", true);
    } else {
      renderList(genres, "playlist-items", "genres", false);
    }
  } else if (currentDisplay === "artists") {
    if (seeAllButton.textContent === "See all") {
      renderList(artists, "playlist-items", "artists", true);
    } else {
      renderList(artists, "playlist-items", "artists", false);
    }
  }
});

// Sự kiện cho icon "Artist"
const artistIcon = document.getElementById("artist-icon");
const artistTile = document.getElementById("title");
artistIcon.addEventListener("click", (event) => {
  event.preventDefault();
  renderList(artists, "playlist-items", "artists", false); // Chuyển sang artists
  artistTile.textContent = "Artsist";
});

// Sự kiện cho icon "Genres"
const genresIcon = document.getElementById("genres-icon");
genresIcon.addEventListener("click", (event) => {
  event.preventDefault();
  renderList(genres, "playlist-items", "genres", false); // Chuyển sang genres
  artistTile.textContent = "Genres";
  seeAllButton.textContent = "See all";
});

// Hiển thị genres khi trang tải
renderList(genres, "playlist-items", "genres", false);

// Nút Play/Pause trong music player
const playButton = document.querySelector(
  ".music-player .player-actions .buttons .play-button",
);
playButton.style.fontSize = "30px";
playButton.addEventListener("click", () => {
  const playerState = player.getPlayerState();
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    playButton.classList.remove("bx-pause");
    playButton.classList.add("bxs-right-arrow");
  } else {
    if (
      playerState === YT.PlayerState.UNSTARTED ||
      playerState === YT.PlayerState.CUED
    ) {
      currentSongIndex = 33;
      playSong([...songs, ...hiddenSongs, ...codeSongs]);
      playButton.classList.remove("bx-right-arrow");
      playButton.classList.add("bxs-pause");
    } else {
      player.playVideo();
      playButton.classList.remove("bx-right-arrow");
      playButton.classList.add("bxs-pause");
    }
  }
});

// Xử lý thay đổi trạng thái của player
function onPlayerStateChange(event) {
  const playButton = document.querySelector(
    ".music-player .player-actions .buttons .play-button",
  );
  if (event.data === YT.PlayerState.PLAYING) {
    const duration = player.getDuration();
    document.querySelector(".total-time").textContent = formatTime(duration);
    startProgressUpdate();
    playButton.classList.remove("bxs-right-arrow");
    playButton.classList.add("bx-pause");
  } else if (event.data === YT.PlayerState.PAUSED) {
    stopProgressUpdate();
    playButton.classList.remove("bx-pause");
    playButton.classList.add("bxs-right-arrow");
  } else if (event.data === YT.PlayerState.ENDED) {
    stopProgressUpdate();
    activeLine.style.flex = "0 0 0%"; // Reset thanh tiến trình
    deactiveLine.style.flex = "0 0 100%";
    currentTimeElem.textContent = "00:00";
    playButton.classList.remove("bx-pause");
    playButton.classList.add("bxs-right-arrow");

    if (repeatMode === "one") {
      // Lặp lại bài hát một lần
      player.seekTo(0);
      player.playVideo();
      repeatMode = "none"; // Sau khi lặp một lần, quay về chế độ không lặp
      repeatButton.classList.remove("active");
      repeatButton.classList.remove("bx-repost");
      repeatButton.classList.add("bx-repeat");
    } else if (repeatMode === "infinite") {
      // Lặp lại bài hát vô hạn
      player.seekTo(0);
      player.playVideo();
    } else {
      const all = [...songs, ...hiddenSongs, ...codeSongs];
      if (shuffleMode) {
        if (shuffleHistory.length >= all.length) {
          // đã phát hết, reset lịch sử (giữ lại current để prev còn dùng)
          const last = shuffleHistory[shuffleHistory.length - 1];
          shuffleHistory = [last];
        }
        // chọn random từ remaining
        const remaining = all
          .map((_, i) => i)
          .filter((i) => !shuffleHistory.includes(i));
        currentSongIndex =
          remaining[Math.floor(Math.random() * remaining.length)];
      } else {
        currentSongIndex = (currentSongIndex + 1) % all.length;
      }
      playSong(all);
    }
  }
}

function renderSongList(songsToRender) {
  const musicList = document.querySelector(".music-list .items");
  musicList.innerHTML = ""; // Xóa danh sách cũ
  songsToRender.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.setAttribute("data-video-id", song.videoId);
    item.innerHTML = `
          <div class="info">
              <p>${String(index + 1).padStart(2, "0")}</p>
              <img src="${song.imageUrl}" alt="">
              <div class="details">
                  <h5>${song.title}</h5>
                  <p>${song.artist}</p>
              </div>
          </div>
          <div class="actions">
              <p>${song.duration || "--:--"}</p>
              <div class="icon">
                  <i class='bx bxs-right-arrow'></i>
              </div>
              <i class='bx bxs-plus-square'></i>
          </div>
      `;
    musicList.appendChild(item);
    // Thêm thuộc tính title và alt ngay sau khi tạo phần tử
    const songTitleElement = item.querySelector(".details h5");
    const artistElement = item.querySelector(".details p");
    songTitleElement.setAttribute("title", song.title);
    songTitleElement.setAttribute("alt", song.title);
    artistElement.setAttribute("title", song.artist);
    artistElement.setAttribute("alt", song.artist);
  });

  // Gắn sự kiện click cho từng nút play
  document
    .querySelectorAll(".music-list .items .item .icon")
    .forEach((playIcon, index) => {
      playIcon.addEventListener("click", () => {
        currentSongIndex = index; // Cập nhật chỉ mục bài hát
        playSong(songsToRender); // Phát bài hát từ danh sách hiện tại
      });
    });
}

// Phát bài hát
function playSong(songsToRender) {
  shuffleHistory.push(currentSongIndex);
  const song = songsToRender[currentSongIndex];
  document.querySelector(".music-player .song-info img").src = song.imageUrl;
  document.querySelector(".music-player .description h3").textContent =
    song.title;
  document.querySelector(".music-player .description h5").textContent =
    song.artist;
  document.querySelector(".music-player .description p").textContent =
    `${song.codesngs} Song's name: ${song.title}`;
  // Reset thanh tiến trình
  activeLine.style.flex = "0 0 0%";
  deactiveLine.style.flex = "0 0 100%";
  currentTimeElem.textContent = "00:00";
  player.loadVideoById(song.videoId);
  player.playVideo();
  currentVideoId = song.videoId;
  // Đánh dấu bài đang phát
  document
    .querySelectorAll(".music-list .items .item")
    .forEach((i) => i.classList.remove("playing"));
  document
    .querySelectorAll(".music-list .items .item")
    [currentSongIndex].classList.add("playing");
}

// Nút Next và Previous
const nextButton = document.querySelector(
  ".music-player .player-actions .buttons .bx-last-page",
);
const prevButton = document.querySelector(
  ".music-player .player-actions .buttons .bx-first-page",
);

nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", prevSong);

// Hàm điều hướng bài hát
function nextSong() {
  const all = [...songs, ...hiddenSongs, ...codeSongs];
  if (shuffleMode) {
    if (shuffleHistory.length >= all.length) {
      // đã phát hết, reset lịch sử (giữ lại current để prev còn dùng)
      const last = shuffleHistory[shuffleHistory.length - 1];
      shuffleHistory = [last];
    }
    // chọn random từ remaining
    const remaining = all
      .map((_, i) => i)
      .filter((i) => !shuffleHistory.includes(i));
    currentSongIndex = remaining[Math.floor(Math.random() * remaining.length)];
  } else {
    currentSongIndex = (currentSongIndex + 1) % all.length;
  }
  playSong(all);
}

function prevSong() {
  const all = [...songs, ...hiddenSongs, ...codeSongs];
  if (shuffleHistory.length > 1) {
    shuffleHistory.pop();
    currentSongIndex = shuffleHistory.pop();
  } else {
    const lastIdx =
      shuffleHistory.length === 1 ? shuffleHistory[0] : currentSongIndex;
    const prevIdx = (lastIdx - 1 + all.length) % all.length;
    currentSongIndex = prevIdx;

    shuffleHistory = [currentSongIndex];
  }

  playSong(all);
}
// Lấy nút repeat
const repeatButton = document.querySelector(
  ".music-player .player-actions .buttons .bx-repeat",
);

// Thêm sự kiện click cho nút repeat
repeatButton.addEventListener("click", () => {
  if (repeatMode === "none") {
    // Chuyển sang chế độ lặp lại một lần
    repeatMode = "one";
    repeatButton.classList.add("active");
    repeatButton.classList.remove("bx-repeat");
    repeatButton.classList.add("bx-repost");
  } else if (repeatMode === "one") {
    // Chuyển sang chế độ lặp lại vô hạn
    repeatMode = "infinite";
    repeatButton.classList.remove("bx-repost");
    repeatButton.classList.add("bx-infinite");
  } else {
    repeatMode = "none";
    repeatButton.classList.remove("active", "infinite");
    repeatButton.classList.remove("bx-repost");
    repeatButton.classList.add("bx-repeat");
  }
});

// transfer mode
const transferButton = document.querySelector(
  ".music-player .player-actions .buttons .bx-transfer-alt",
);
transferButton.addEventListener("click", () => {
  shuffleMode = !shuffleMode; // Chuyển đổi giữa true và false
  if (shuffleMode) {
    transferButton.classList.add("bx-transfer");
    transferButton.classList.remove("bx-transfer-alt");
    // Chuyển sang bài ngẫu nhiên
    // Khởi tạo lịch sử mới
    shuffleHistory = [currentSongIndex];
  } else {
    transferButton.classList.remove("bx-transfer");
    transferButton.classList.add("bx-transfer-alt");
    // Chuyển sang bài kế tiếp tuần tự
    // Xóa lịch sử
    shuffleHistory = [];
  }
});

// Cập nhật thanh tiến trình
const activeLine = document.querySelector(".active-line");
const deactiveLine = document.querySelector(".deactive-line");
const currentTimeElem = document.querySelector(".current-time");

function startProgressUpdate() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      activeLine.style.flex = `0 0 ${progressPercent}%`;
      deactiveLine.style.flex = `0 0 ${100 - progressPercent}%`;
      currentTimeElem.textContent = formatTime(currentTime);
    }
  }, 1000);
}

function stopProgressUpdate() {
  if (progressInterval) clearInterval(progressInterval);
}

// Tua bài hát khi nhấp vào thanh tiến trình
const progressBar = document.querySelector(".progress-bar");
progressBar.addEventListener("click", (event) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  const duration = player.getDuration();
  const seekTime = percent * duration;
  player.seekTo(seekTime);
});

// Định dạng thời gian
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + (secs < 10 ? "0" + secs : secs);
}

// Khởi tạo ứng dụng
function init() {
  renderSongList(songs);

  const seeAllBtn = document.getElementById("see-all");
  if (seeAllBtn) {
    seeAllBtn.textContent = "See all";
  }

  isShowingAll = false;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Ngăn chặn nút quay lại
function preventBack() {
  window.history.forward();
}

setTimeout("preventBack()", 0);
window.onunload = function () {
  null;
};

// Hàm để hiển thị thông báo hết giờ
function showAlarmNotification() {
  if (confirm("Hết giờ! Bạn có muốn tắt báo thức không?")) {
    clearAlarm();
  } else {
    // Nếu người dùng không tắt, tiếp tục lặp lại báo thức
    startAlarm();
  }
}

// Lấy các phần tử
const alarmIcon = document.querySelector(".bxs-alarm");
const alarmOptionsModal = document.getElementById("alarm-options-modal");
const closeAlarmOptions = document.getElementById("close-alarm-options");
const setAlarmTimeButton = document.getElementById("set-alarm-time");
const adjustSpeedButton = document.getElementById("adjust-speed");

// Hàm hiển thị modal tùy chọn alarm
function showAlarmOptions() {
  alarmOptionsModal.style.display = "block";
}

// Hàm đóng modal tùy chọn alarm
function closeAlarmOptionsModal() {
  alarmOptionsModal.style.display = "none";
}

// Sự kiện click cho nút alarm
alarmIcon.addEventListener("click", showAlarmOptions);

// Sự kiện click cho nút đóng modal
closeAlarmOptions.addEventListener("click", closeAlarmOptionsModal);

// Sự kiện click cho nút "Chọn giờ báo thức"
setAlarmTimeButton.addEventListener("click", () => {
  closeAlarmOptionsModal();
  const alarmTime = prompt("Nhập thời gian báo thức (HH:MM):");
  if (alarmTime) {
    document.getElementById("alarmTime").value = alarmTime;
    startAlarm();
  }
});

// Sự kiện click cho nút "Điều chỉnh tốc độ phát"
adjustSpeedButton.addEventListener("click", () => {
  closeAlarmOptionsModal();
  const speed = prompt("Nhập tốc độ phát (ví dụ: 0.5, 1, 1.5, 2):");
  if (speed) {
    const speedValue = parseFloat(speed);
    if (!isNaN(speedValue) && speedValue > 0) {
      player.setPlaybackRate(speedValue);
      alert(`Tốc độ phát đã được đặt thành ${speedValue}x`);
    } else {
      alert("Vui lòng nhập một giá trị hợp lệ!");
    }
  }
});

// Hàm để bắt đầu báo thức
function startAlarm() {
  const alarmTime = document.getElementById("alarmTime").value; // Lấy thời gian từ input
  if (!alarmTime) {
    alert("Vui lòng nhập thời gian báo thức!");
    return;
  }

  const now = new Date();
  const alarmDate = new Date(now.toDateString() + " " + alarmTime);

  if (alarmDate < now) {
    alert("Thời gian báo thức phải lớn hơn thời gian hiện tại!");
    return;
  }

  const timeUntilAlarm = alarmDate - now;

  alarmTimeout = setTimeout(() => {
    showAlarmNotification();
    playAlarm(); // Phát nhạc báo thức
  }, timeUntilAlarm);

  // Hiển thị đếm ngược
  alarmInterval = setInterval(() => {
    const remainingTime = alarmDate - new Date();
    if (remainingTime <= 0) {
      clearInterval(alarmInterval);
    } else {
      console.log(`Còn lại: ${Math.floor(remainingTime / 1000)} giây`);
    }
  }, 1000);
}

// Hàm để dừng báo thức
function clearAlarm() {
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
  }
  if (alarmInterval) {
    clearInterval(alarmInterval);
  }
  stopAlarm(); // Dừng nhạc báo thức
}

// Hàm để phát nhạc báo thức
function playAlarm() {
  alert("Hết Thời gian bạn êyyyy!!");
  const alarmVideoId = "hqt0goNf_nA";
  player.loadVideoById(alarmVideoId);
  player.playVideo();
}

// Hàm để dừng nhạc báo thức
function stopAlarm() {
  player.stopVideo();
}

const VOLUME_STORAGE_KEY = "musicPlayerVolume";
const PREV_VOLUME_KEY = "musicPlayerPrevVolume";

function getStoredVolume() {
  const stored = localStorage.getItem(VOLUME_STORAGE_KEY);

  if (stored === null) return 50;

  const value = Number(stored);
  return Number.isNaN(value) ? 50 : value;
}

let currentVolume = getStoredVolume();
const volumeIcon = document.getElementById("volume-icon");
const volumeSlider = document.getElementById("volume-slider");

if (volumeSlider) {
  volumeSlider.value = currentVolume;
}

// Cập nhật biểu tượng theo mức âm lượng
function updateVolumeIcon(volume) {
  if (volume == 0) {
    volumeIcon.className = "bx bx-volume-mute";
  } else if (volume <= 59) {
    volumeIcon.className = "bx bx-volume-low";
  } else {
    volumeIcon.className = "bx bx-volume-full";
  }
}

function applyVolume(volume) {
  currentVolume = Number(volume);

  if (player && typeof player.setVolume === "function") {
    player.setVolume(currentVolume);
  }

  if (volumeSlider) {
    volumeSlider.value = currentVolume;
  }

  updateVolumeIcon(currentVolume);

  localStorage.setItem(VOLUME_STORAGE_KEY, currentVolume);
}

// Khi kéo slider volume
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    applyVolume(e.target.value);
  });
}

// Click icon để mute/unmute
if (volumeIcon) {
  volumeIcon.addEventListener("click", () => {
    if (currentVolume > 0) {
      // Lưu lại volume trước khi mute
      localStorage.setItem(PREV_VOLUME_KEY, currentVolume);
      applyVolume(0);
    } else {
      // Khôi phục volume trước khi bị mute
      const prevVolume = Number(localStorage.getItem(PREV_VOLUME_KEY)) || 100;
      applyVolume(prevVolume);
    }
  });
}

updateVolumeIcon(currentVolume);

// Thay đổi âm lượng khi kéo slider
volumeSlider.addEventListener("input", (e) => {
  currentVolume = e.target.value;
  player.setVolume(currentVolume);
  updateVolumeIcon(currentVolume);
});

// Click icon để mute/unmute
volumeIcon.addEventListener("click", () => {
  if (currentVolume > 0) {
    currentVolume = 0;
  } else {
    currentVolume = 100;
  }
  volumeSlider.value = currentVolume;
  player.setVolume(currentVolume);
  updateVolumeIcon(currentVolume);
});

// Khởi tạo âm lượng khi load trang
window.addEventListener("load", () => {
  if (volumeSlider) {
    volumeSlider.value = currentVolume;
  }

  updateVolumeIcon(currentVolume);

  if (player && typeof player.setVolume === "function") {
    player.setVolume(currentVolume);
  }
});

// Thêm hiệu ứng hover
const volumeContainer = document.querySelector(".volume-container");
const volumeSliderWrapper = document.querySelector(".volume-slider-wrapper");

volumeContainer.addEventListener("mouseenter", () => {
  volumeSliderWrapper.style.opacity = "1";
  volumeSliderWrapper.style.visibility = "visible";
});

volumeContainer.addEventListener("mouseleave", () => {
  volumeSliderWrapper.style.opacity = "0";
  volumeSliderWrapper.style.visibility = "hidden";
});

// Thêm vào cuối file scripts.js
// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");

// Kiểm tra theme đã lưu
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.classList.add(savedTheme);
  updateThemeIcon();
}

// Xử lý sự kiện click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  // Lưu trạng thái vào localStorage
  const isLightMode = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLightMode ? "light-mode" : "");

  updateThemeIcon();
});

// Cập nhật icon
function updateThemeIcon() {
  const isLightMode = document.body.classList.contains("light-mode");
  themeToggle.classList.toggle("bx-moon", !isLightMode);
  themeToggle.classList.toggle("bx-sun", isLightMode);
}

async function getVideoDuration(videoId) {
  const apiKey = "AIzaSyAXZGI4CqvBexNG30nuRiwGhHqB85l0pYs";
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
    }
    const data = await response.json();
    if (data.items.length === 0) {
      console.error("Video không tồn tại hoặc ID không hợp lệ.");
      return null;
    }
    const duration = data.items[0].contentDetails.duration;
    return formatDuration(duration);
  } catch (error) {
    console.error("Lỗi khi lấy duration:", error);
    return null;
  }
}

function formatDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  const totalMinutes = hours * 60 + minutes;
  return `${totalMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

async function initSongs() {
  const allSongs = [...songs, ...hiddenSongs, ...codeSongs];

  for (const song of allSongs) {
    // Nếu đã có duration hợp lệ rồi thì không cần gọi API nữa
    if (song.duration && song.duration !== "null") {
      continue;
    }

    const apiDuration = await getVideoDuration(song.videoId);

    // Chỉ cập nhật khi API trả về giá trị hợp lệ
    if (apiDuration) {
      song.duration = apiDuration;
    } else {
      // API lỗi thì giữ duration cũ, nếu không có thì hiển thị placeholder
      song.duration = song.duration || "--:--";
    }
  }

  renderSongList(allSongs);
}

// window.addEventListener("load", () => {
//   initSongs();
// });

let isShowingAll = false;

document.getElementById("see-all").addEventListener("click", function (event) {
  event.preventDefault();

  if (!isShowingAll) {
    const allSongs = [...songs, ...hiddenSongs];
    renderSongList(allSongs, false);
    this.textContent = "Hide";
    isShowingAll = true;
  } else {
    renderSongList(songs, false);
    this.textContent = "See all";
    isShowingAll = false;
  }

  const currentList = isShowingAll ? [...songs, ...hiddenSongs] : songs;

  const newIndex = currentList.findIndex(
    (song) => song.videoId === currentVideoId,
  );

  if (newIndex !== -1) {
    currentSongIndex = newIndex;
  } else {
    currentSongIndex = 0;
  }
});

const searchInput = document.querySelector(".search input");
const searchIcon = document.getElementById("search-icon");
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const query = event.target.value.trim();
    searchSong(query);
  }
});

searchIcon.addEventListener("click", function (event) {
  const query = searchInput.value.trim();
  if (query) {
    searchSong(query);
  }
});

function searchSong(query) {
  const song = [...songs, ...hiddenSongs, ...codeSongs].find(
    (song) => song.codesngs == query,
  );
  const songif2 = [...songs, ...hiddenSongs, ...codeSongs].find(
    (songif2) => songif2.title == query,
  );
  if (song || songif2) {
    if (song) {
      const index = [...songs, ...hiddenSongs, ...codeSongs].indexOf(song);
      currentSongIndex = index;
      playSong([...songs, ...hiddenSongs, ...codeSongs]);
      renderSongList([...songs, ...hiddenSongs, ...codeSongs]); // Cập nhật danh sách hiển thị
      searchInput.value = ""; // Xóa ô input sau khi tìm thấy
    } else {
      const index = [...songs, ...hiddenSongs, ...codeSongs].indexOf(songif2);
      currentSongIndex = index;
      playSong([...songs, ...hiddenSongs, ...codeSongs]);
      renderSongList([...songs, ...hiddenSongs, ...codeSongs]); // Cập nhật danh sách hiển thị
      searchInput.value = ""; // Xóa ô input sau khi tìm thấy
    }
  } else {
    alert(
      "Không tìm thấy bài hát này, vui lòng tìm kiếm lại bằng code hoặc nhập tên đúng với quy tắc.",
    );
  }
}

// Lấy các phần tử
const settingsModal = document.getElementById("settings-modal");
const settingsForm = document.getElementById("settings-form");
const closeModal = document.querySelector(".modal .close-modal");
const cogIcon = document.querySelector(".profile .bxs-cog");
let avatarFile = null;

document
  .getElementById("avatar-upload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatarFile = e.target.result; // Lưu chuỗi base64 vào avatarFile
      };
      reader.readAsDataURL(file);
    }
  });

// Hàm hiển thị modal và điền dữ liệu hiện tại
function showSettingsModal() {
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (userData) {
      document.getElementById("username-input").value = currentUser;
      document.getElementById("password").value = userData.password || "";
      const genderInputs = document.querySelectorAll(".gender-input");
      genderInputs.forEach((input) => {
        if (input.value === userData.gender) {
          input.checked = true;
        }
      });
    }
  }
  settingsModal.style.display = "block";
}

function loadUserAvatar() {
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    const userAvatar = document.getElementById("userAvatar");
    if (userData && userData.avatar) {
      userAvatar.src = userData.avatar; // Hiển thị ảnh từ localStorage
    } else {
      userAvatar.src = "default-avatar.png"; // Ảnh mặc định nếu không có
    }
  }
}

window.addEventListener("load", () => {
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if (userData?.avatar) {
      document.getElementById("userAvatar").src = userData.avatar;
    }
  }
});

// Gọi hàm khi trang tải
window.onload = loadUserAvatar;

// Hàm đóng modal
function closeSettingsModal() {
  settingsModal.style.display = "none";
}

// Sự kiện click cho biểu tượng cog
cogIcon.addEventListener("click", showSettingsModal);

// Sự kiện click cho nút đóng
closeModal.addEventListener("click", closeSettingsModal);

// Sự kiện submit form
settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = getCurrentUser();

  if (currentUser) {
    const newUsername = document.getElementById("username-input").value;
    const newPassword = document.getElementById("password").value;
    const selectedGender = document.querySelector(
      'input[name="gender"]:checked',
    );
    const newGender = selectedGender ? selectedGender.value : null;

    if (newGender) {
      const userData = JSON.parse(localStorage.getItem(currentUser)) || {};

      userData.password = newPassword;
      userData.gender = newGender;

      if (avatarFile) {
        userData.avatar = avatarFile;
      }

      if (newUsername !== currentUser) {
        localStorage.removeItem(currentUser);
        localStorage.setItem(newUsername, JSON.stringify(userData));
        setCurrentUser(newUsername);
      } else {
        localStorage.setItem(currentUser, JSON.stringify(userData));
      }

      if (avatarFile) {
        document.getElementById("userAvatar").src = avatarFile;
      } else if (userData.avatar) {
        document.getElementById("userAvatar").src = userData.avatar;
      } else {
        document.getElementById("userAvatar").src = "default-avatar.png";
      }

      document.getElementById("username").textContent = newUsername;

      alert("Thay đổi đã được lưu thành công!");
      closeSettingsModal();
    } else {
      alert("Vui lòng chọn giới tính!");
    }
  }
});

const uploadIcon = document.getElementById("upload-icon");
const uploadModal = document.getElementById("upload-modal");
const uploadForm = document.getElementById("upload-form");
const close_upload_Modal = document.querySelector("#upload-modal .close");

// Hàm hiển thị modal
function showUploadModal() {
  const currentUser = sessionStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Bạn cần đăng nhập để tải lên bài hát!");
    return;
  }
  uploadModal.style.display = "block";
}

// Hàm đóng modal
function closeUploadModal() {
  uploadModal.style.display = "none";
  uploadForm.reset(); // Xóa dữ liệu trong form
}

// Sự kiện click cho icon tải lên
uploadIcon.addEventListener("click", showUploadModal);

// Sự kiện click cho nút đóng
close_upload_Modal.addEventListener("click", closeUploadModal);

// ==========================================
// EXPOSE DATA & FUNCTIONS FOR EXPLORE PAGE
// ==========================================
window.RELACK_PLAYER = {
  playSong: playSong,
  getCurrentIndex: () => currentSongIndex,
  setCurrentIndex: (idx) => {
    currentSongIndex = idx;
  },
};
