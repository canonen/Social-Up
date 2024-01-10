
const aramaInput = document.getElementById('searchInput');
const aramaSonuclariDiv = document.getElementById('aramaSonuclari');

aramaInput.addEventListener('input', async () => {
  const sorgu = aramaInput.value;

  // Her arama yapıldığında mevcut sonuçları temizle
  aramaSonuclariDiv.innerHTML = "";

  if(sorgu.length > 2){
      const response = await fetch(`/search?q=${sorgu}`);
      const sonuclar = await response.json();
      if (aramaInput.value === sorgu){
        sonuclar.forEach((sonuc) => {
            const yeniDiv = document.createElement('div');
            yeniDiv.classList.add('search_user');

            // İçeriği ayarlayın (Bu kısmı sizin sonuca göre uyarlamalısınız)
            yeniDiv.innerHTML = `
                <a class="nav-link" href="/profile?userId=${sonuc._id}" role="button" " style="display: flex;justify-content: center; align-items: center;color:rgb(79, 78, 78); font-size: 19px;">
                    <img src="${sonuc.image ?? '/images/default_avatar.png'}" alt="User Avatar" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 5px;">
                    <p class="m-0 ml-1">
                        ${sonuc.name.charAt(0).toUpperCase() + sonuc.name.slice(1)} ${sonuc.surname.charAt(0).toUpperCase() + sonuc.surname.slice(1)}
                    </p>
                </a>
            `

            // Yeni div'i aramaSonuclari div'ine ekleyin
            aramaSonuclariDiv.appendChild(yeniDiv);
        
        });
      }
  } else {
      // Kullanıcı arama yapmayı bıraktığında sonuçları temizle
      aramaSonuclariDiv.innerHTML = "";
  }
});
aramaInput.addEventListener('blur', () => {
  setTimeout(() => {
      if (!aramaSonuclariDiv.contains(document.activeElement)) {
          aramaSonuclariDiv.style.display = 'none';
      }
  }, 100);
});

aramaInput.addEventListener('focus', () => {
  aramaSonuclariDiv.style.display = 'flex';
});

document.getElementById("search-box").addEventListener('blur', () => {
  aramaSonuclariDiv.style.display = 'none';
});


