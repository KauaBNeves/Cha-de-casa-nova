// ATENÇÃO: Substitua este URL pelo URL do seu script do Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtJCOohGuoKg9NQL9e0DvdOcnaMboXg6vbtGd7Te4PA9A4LogjY77Ey5dmNNPe0IbDlQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    fetchGifts();
});

async function fetchGifts() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getGifts`);
        const gifts = await response.json();
        const select = document.getElementById('giftList');
        
        select.innerHTML = '<option value="">Selecione um presente...</option>';
        
        gifts.forEach(gift => {
            if (gift[1] === '') {
                const option = document.createElement('option');
                option.value = gift[0];
                option.textContent = gift[0];
                select.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Erro ao buscar a lista de presentes:', error);
    }
}

// NOVO CÓDIGO: EXIBE A IMAGEM AO SELECIONAR UM ITEM
document.getElementById('giftList').addEventListener('change', (e) => {
    const selectedGift = e.target.value;
    const giftImage = document.getElementById('giftImage');

    if (selectedGift) {
        // Assume que as imagens estão na pasta 'images' e são .jpg
        giftImage.src = 'images/' + selectedGift + '.jpg';
        giftImage.style.display = 'block';
    } else {
        giftImage.style.display = 'none';
        giftImage.src = '';
    }
});

document.getElementById('giftForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const guestName = document.getElementById('guestName').value;
    const selectedGift = document.getElementById('giftList').value;
    const messageDiv = document.getElementById('message');

    if (!guestName || !selectedGift) {
        messageDiv.textContent = 'Por favor, preencha todos os campos.';
        messageDiv.style.color = 'red';
        return;
    }

    const data = {
        action: 'recordGift',
        guestName: guestName,
        giftName: selectedGift
    };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
            messageDiv.textContent = 'Obrigado! Seu presente foi confirmado.';
            messageDiv.style.color = 'green';
            document.getElementById('giftForm').reset();
            fetchGifts();
        } else {
            messageDiv.textContent = `Erro: ${result.message}`;
            messageDiv.style.color = 'red';
        }

    } catch (error) {
        messageDiv.textContent = 'Erro ao confirmar o presente. Tente novamente.';
        messageDiv.style.color = 'red';
        console.error('Erro:', error);
    }
});