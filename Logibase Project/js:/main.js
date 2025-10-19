// Основной файл JavaScript - инициализация приложения

console.log('🚀 LogiBase App Loading...');

// Главная функция инициализации
function initializeApp() {
    console.log('✅ Initializing LogiBase...');
    
    // Базовая инициализация
    initializeLanguageSwitcher();
    initializeNavigation();
    initializeLoginSystem();
    setupCalculatorInteractions();
    initializeVehicleSelection();
    initializePriceCalculation();
    
    showNotification('Willkommen bei LogiBase! Berechnen Sie jetzt Ihren Transportpreis.', 'info');
    
    console.log('🎉 LogiBase Ready!');
}

// Переключение языка
function initializeLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Активируем кнопку
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Показываем/скрываем языковые блоки
            document.querySelectorAll('.lang-de').forEach(el => {
                el.style.display = lang === 'de' ? 'block' : 'none';
            });
            document.querySelectorAll('.lang-en').forEach(el => {
                el.style.display = lang === 'en' ? 'block' : 'none';
            });
        });
    });
}

// Навигация
function initializeNavigation() {
    // Плавный скролл для навигационных ссылок
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Плавный скролл для CTA кнопок
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Система логина
function initializeLoginSystem() {
    const users = {
        'Michael': { password: '123', name: 'Michael', role: 'admin' },
        'kunde': { password: 'kunde123', name: 'Max Mustermann', role: 'customer' }
    };

    // Показ информации пользователя
    function showUserInfo(username) {
        document.getElementById('userName').textContent = users[username].name;
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('loginForm').style.display = 'none';
    }

    // Скрытие информации пользователя
    function hideUserInfo() {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // Обработчик формы логина
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginBtn = this.querySelector('.login-btn');
        
        if (!username.trim() || !password.trim()) {
            showNotification('Bitte geben Sie Benutzername und Passwort ein', 'error');
            return;
        }
        
        // Состояние загрузки
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Wird geladen...';
        loginBtn.disabled = true;
        
        // Имитация API вызова
        setTimeout(() => {
            if (users[username] && users[username].password === password) {
                showUserInfo(username);
                localStorage.setItem('loggedInUser', username);
                showNotification('Erfolgreich angemeldet als ' + users[username].name, 'success');
            } else {
                showNotification('Ungültiger Benutzername oder Passwort', 'error');
            }
            
            // Сброс кнопки
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }, 1000);
    });

    // Обработчик логаута
    document.getElementById('logoutBtn').addEventListener('click', function() {
        hideUserInfo();
        localStorage.removeItem('loggedInUser');
        showNotification('Erfolgreich abgemeldet', 'success');
    });

    // Проверка если пользователь уже залогинен
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showUserInfo(loggedInUser);
    }
}

// Базовые взаимодействия калькулятора
function setupCalculatorInteractions() {
    // Показ секций при вводе данных
    const fromLocation = document.getElementById('from-location');
    const toLocation = document.getElementById('to-location');
    
    [fromLocation, toLocation].forEach(input => {
        input.addEventListener('input', function() {
            if (fromLocation.value.trim() && toLocation.value.trim()) {
                showSection('date-time-section');
            }
        });
    });

    // Инициализация дат
    setupDateValidation();

    // Выбор типа груза
    initializeCargoTypeSelection();

    // Управление паллетами
    initializePalletManagement();

    // Стекинг (штабелирование)
    initializeStackingToggles();

    // Отправка формы
    setupFormSubmission();
}

// Показ секции с анимацией
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && !section.classList.contains('visible')) {
        section.classList.add('visible');
        
        // Плавный скролл к секции
        setTimeout(() => {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 400);
    }
}

// Валидация дат
function setupDateValidation() {
    const now = new Date();
    const nowString = now.toISOString().slice(0, 16);
    
    // Установка минимальных дат
    document.getElementById('loading-date').min = nowString;
    document.getElementById('unloading-date').min = nowString;
    
    // Установка значений по умолчанию
    const loadingDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const loadingDateString = loadingDate.toISOString().slice(0, 16);
    
    const unloadingDate = new Date(loadingDate.getTime() + 2 * 60 * 60 * 1000);
    const unloadingDateString = unloadingDate.toISOString().slice(0, 16);
    
    document.getElementById('loading-date').value = loadingDateString;
    document.getElementById('unloading-date').value = unloadingDateString;
    
    // Валидация даты выгрузки
    document.getElementById('loading-date').addEventListener('change', function() {
        const loadingDate = new Date(this.value);
        const unloadingInput = document.getElementById('unloading-date');
        
        unloadingInput.min = this.value;
        
        const unloadingDate = new Date(unloadingInput.value);
        if (unloadingDate < loadingDate) {
            const newUnloadingDate = new Date(loadingDate.getTime() + 2 * 60 * 60 * 1000);
            unloadingInput.value = newUnloadingDate.toISOString().slice(0, 16);
        }

        // Показываем следующую секцию
        if (this.value) {
            showSection('cargo-type-section');
        }
    });
}

// Выбор типа груза
function initializeCargoTypeSelection() {
    document.querySelectorAll('.cargo-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cargo-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            
            // Скрываем все секции паллет
            document.getElementById('individual-pallets-section').classList.remove('visible');
            document.getElementById('standard-pallets-section').classList.remove('visible');
            
            // Показываем выбранную секцию
            if (type === 'individual') {
                showSection('individual-pallets-section');
                addFirstPallet();
            } else {
                showSection('standard-pallets-section');
            }
            
            // Показываем секцию транспорта
            setTimeout(() => {
                showSection('vehicle-section');
            }, 500);
        });
    });
}

// Управление паллетами
let palletCounter = 0;

function initializePalletManagement() {
    // Кнопка добавления паллеты
    document.getElementById('add-pallet-btn').addEventListener('click', function() {
        addIndividualPallet(true);
    });

    // Вводы для стандартных паллет
    document.getElementById('pallet-count')?.addEventListener('input', calculateStandardStacking);
    document.getElementById('pallet-weight')?.addEventListener('input', calculateStandardStacking);

    // Выбор типа паллеты
    document.querySelectorAll('.pallet-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.pallet-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateStandardStacking();
        });
    });
}

// Добавление первой паллеты
function addFirstPallet() {
    addIndividualPallet(false);
}

// Добавление индивидуальной паллеты
function addIndividualPallet(empty = false) {
    palletCounter++;
    const container = document.getElementById('individual-pallets-container');
    const palletItem = document.createElement('div');
    palletItem.className = 'pallet-item';
    palletItem.setAttribute('data-pallet-id', palletCounter);
    
    const defaultValue = empty ? '' : (palletCounter === 1 ? '100' : '');
    const weightValue = empty ? '' : (palletCounter === 1 ? '500' : '');
    
    palletItem.innerHTML = `
        <div class="dimension-item">
            <label class="lang-de">Länge (cm)</label>
            <label class="lang-en">Length (cm)</label>
            <input type="number" name="pallet-length-${palletCounter}" min="1" max="400" placeholder="120" value="${defaultValue}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Breite (cm)</label>
            <label class="lang-en">Width (cm)</label>
            <input type="number" name="pallet-width-${palletCounter}" min="1" max="400" placeholder="80" value="${defaultValue}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Höhe (cm)</label>
            <label class="lang-en">Height (cm)</label>
            <input type="number" name="pallet-height-${palletCounter}" min="1" max="400" placeholder="100" value="${defaultValue}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Gewicht (kg)</label>
            <label class="lang-en">Weight (kg)</label>
            <input type="number" name="pallet-weight-${palletCounter}" min="1" max="5000" placeholder="500" value="${weightValue}">
        </div>
        <button type="button" class="duplicate-pallet-btn" onclick="duplicatePallet(this)" title="Palette duplizieren">
            <span>📋</span>
        </button>
        ${palletCounter > 1 ? '<button type="button" class="remove-pallet-btn" onclick="removePallet(this)" title="Palette entfernen">×</button>' : 
          '<button type="button" class="remove-pallet-btn" disabled style="background: var(--accent); cursor: not-allowed;">×</button>'}
    `;
    
    container.appendChild(palletItem);
    
    // Добавляем обработчики событий для расчета в реальном времени
    const inputs = palletItem.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateStacking();
            updateVehicleSelection();
        });
    });
    
    calculateStacking();
    updateVehicleSelection();
}

// Глобальные функции для кнопок паллет
function duplicatePallet(button) {
    const palletItem = button.parentElement;
    const container = document.getElementById('individual-pallets-container');
    
    // Получаем значения текущей паллеты
    const inputs = palletItem.querySelectorAll('input[type="number"]');
    const currentValues = Array.from(inputs).map(input => input.value);
    
    // Создаем новую паллету с ТАКИМИ ЖЕ значениями
    const newPalletItem = document.createElement('div');
    newPalletItem.className = 'pallet-item';
    newPalletItem.setAttribute('data-pallet-id', palletCounter + 1);
    
    newPalletItem.innerHTML = `
        <div class="dimension-item">
            <label class="lang-de">Länge (cm)</label>
            <label class="lang-en">Length (cm)</label>
            <input type="number" name="pallet-length-${palletCounter + 1}" min="1" max="400" placeholder="120" value="${currentValues[0] || ''}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Breite (cm)</label>
            <label class="lang-en">Width (cm)</label>
            <input type="number" name="pallet-width-${palletCounter + 1}" min="1" max="400" placeholder="80" value="${currentValues[1] || ''}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Höhe (cm)</label>
            <label class="lang-en">Height (cm)</label>
            <input type="number" name="pallet-height-${palletCounter + 1}" min="1" max="400" placeholder="100" value="${currentValues[2] || ''}">
        </div>
        <div class="dimension-item">
            <label class="lang-de">Gewicht (kg)</label>
            <label class="lang-en">Weight (kg)</label>
            <input type="number" name="pallet-weight-${palletCounter + 1}" min="1" max="5000" placeholder="500" value="${currentValues[3] || ''}">
        </div>
        <button type="button" class="duplicate-pallet-btn" onclick="duplicatePallet(this)" title="Palette duplizieren">
            <span>📋</span>
        </button>
        <button type="button" class="remove-pallet-btn" onclick="removePallet(this)" title="Palette entfernen">×</button>
    `;
    
    container.appendChild(newPalletItem);
    palletCounter++;
    
    // Добавляем обработчики
    const newInputs = newPalletItem.querySelectorAll('input');
    newInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateStacking();
            updateVehicleSelection();
        });
    });
    
    calculateStacking();
    updateVehicleSelection();
    showNotification('✅ Palette wurde dupliziert!', 'success');
}

function removePallet(button) {
    if (document.querySelectorAll('.pallet-item').length > 1) {
        button.parentElement.remove();
        calculateStacking();
        updateVehicleSelection();
        showNotification('🗑️ Palette wurde entfernt', 'info');
    }
}

// Стекинг (штабелирование)
function initializeStackingToggles() {
    // Индивидуальные паллеты
    document.getElementById('individual-stapelbar').addEventListener('change', function() {
        const levelsInput = document.getElementById('individual-levels-input');
        if (this.checked) {
            levelsInput.classList.add('visible');
            calculateStacking();
        } else {
            levelsInput.classList.remove('visible');
            calculateStacking();
        }
        updateVehicleSelection();
    });

    // Стандартные паллеты
    document.getElementById('standard-stapelbar').addEventListener('change', function() {
        const levelsInput = document.getElementById('standard-levels-input');
        if (this.checked) {
            levelsInput.classList.add('visible');
            calculateStandardStacking();
        } else {
            levelsInput.classList.remove('visible');
            calculateStandardStacking();
        }
        updateVehicleSelection();
    });

    // Вводы высоты стекирования
    document.getElementById('max-stack-height').addEventListener('input', function() {
        calculateStacking();
        updateVehicleSelection();
    });
    document.getElementById('standard-max-height').addEventListener('input', function() {
        calculateStandardStacking();
        updateVehicleSelection();
    });
}

// Расчет стекирования для индивидуальных паллет
function calculateStacking() {
    const isStapelbar = document.getElementById('individual-stapelbar').checked;
    const maxStackHeight = parseInt(document.getElementById('max-stack-height').value) || 250;
    const MAX_STACK_LEVELS = 2;
    
    const palletItems = document.querySelectorAll('.pallet-item');
    let totalWeight = 0;
    let maxPalletHeight = 0;
    let totalBasePallets = 0;
    
    // Расчет базовых значений
    palletItems.forEach(item => {
        const lengthInput = item.querySelector('input[type="number"]:nth-child(1)');
        const widthInput = item.querySelector('input[type="number"]:nth-child(2)');
        const heightInput = item.querySelector('input[type="number"]:nth-child(3)');
        const weightInput = item.querySelector('input[type="number"]:nth-child(4)');
        
        if (heightInput && heightInput.value) {
            const height = parseInt(heightInput.value) || 0;
            if (height > maxPalletHeight) maxPalletHeight = height;
        }
        if (weightInput && weightInput.value) {
            const weight = parseInt(weightInput.value) || 0;
            totalWeight += weight;
        }
        totalBasePallets++;
    });
    
    if (isStapelbar && maxPalletHeight > 0) {
        // Расчет стекирования с ограничением по высоте
        const levelsPerStack = Math.min(
            MAX_STACK_LEVELS, 
            Math.floor(maxStackHeight / maxPalletHeight)
        );
        
        const effectivePallets = totalBasePallets * levelsPerStack;
        const spaceSaving = Math.round((1 - (totalBasePallets / effectivePallets)) * 100);
        
        // Обновление информации о стекировании
        document.getElementById('effective-pallets').textContent = effectivePallets;
        document.getElementById('stack-levels').textContent = levelsPerStack;
        document.getElementById('stack-weight').textContent = (totalWeight * levelsPerStack) + ' kg';
        document.getElementById('space-saving').textContent = spaceSaving + '%';
        document.getElementById('individual-stacking-info').classList.add('visible');
        
        return {
            effectivePallets: effectivePallets,
            levels: levelsPerStack,
            totalWeight: totalWeight * levelsPerStack,
            spaceSaving: spaceSaving,
            isStacked: true,
            maxPalletHeight: maxPalletHeight
        };
    } else {
        // Сброс информации о стекировании
        document.getElementById('effective-pallets').textContent = totalBasePallets;
        document.getElementById('stack-levels').textContent = 1;
        document.getElementById('stack-weight').textContent = totalWeight + ' kg';
        document.getElementById('space-saving').textContent = '0%';
        document.getElementById('individual-stacking-info').classList.remove('visible');
        
        return {
            effectivePallets: totalBasePallets,
            levels: 1,
            totalWeight: totalWeight,
            spaceSaving: 0,
            isStacked: false,
            maxPalletHeight: maxPalletHeight
        };
    }
}

// Расчет стекирования для стандартных паллет
function calculateStandardStacking() {
    const isStapelbar = document.getElementById('standard-stapelbar').checked;
    const maxStackHeight = parseInt(document.getElementById('standard-max-height').value) || 250;
    const palletCount = parseInt(document.getElementById('pallet-count').value) || 0;
    const palletWeight = parseInt(document.getElementById('pallet-weight').value) || 0;
    const MAX_STACK_LEVELS = 2;
    const STANDARD_PALLET_HEIGHT = 150;
    
    if (isStapelbar) {
        const levelsPerStack = Math.min(
            MAX_STACK_LEVELS, 
            Math.floor(maxStackHeight / STANDARD_PALLET_HEIGHT)
        );
        
        const effectivePallets = palletCount * levelsPerStack;
        const spaceSaving = Math.round((1 - (palletCount / effectivePallets)) * 100);
        
        // Обновление информации о стекировании
        document.getElementById('standard-effective-pallets').textContent = effectivePallets;
        document.getElementById('standard-stack-levels').textContent = levelsPerStack;
        document.getElementById('standard-stack-weight').textContent = (palletWeight * effectivePallets) + ' kg';
        document.getElementById('standard-space-saving').textContent = spaceSaving + '%';
        document.getElementById('standard-stacking-info').classList.add('visible');
        
        return {
            effectivePallets: effectivePallets,
            levels: levelsPerStack,
            totalWeight: palletWeight * effectivePallets,
            spaceSaving: spaceSaving,
            isStacked: true,
            maxPalletHeight: STANDARD_PALLET_HEIGHT
        };
    } else {
        // Сброс информации о стекировании
        document.getElementById('standard-effective-pallets').textContent = palletCount;
        document.getElementById('standard-stack-levels').textContent = 1;
        document.getElementById('standard-stack-weight').textContent = (palletWeight * palletCount) + ' kg';
        document.getElementById('standard-space-saving').textContent = '0%';
        document.getElementById('standard-stacking-info').classList.remove('visible');
        
        return {
            effectivePallets: palletCount,
            levels: 1,
            totalWeight: palletWeight * palletCount,
            spaceSaving: 0,
            isStacked: false,
            maxPalletHeight: STANDARD_PALLET_HEIGHT
        };
    }
}

// Расчет данных о грузе
function calculateCargoData() {
    const cargoType = document.querySelector('.cargo-type-btn.active').getAttribute('data-type');
    let totalWeight = 0;
    let totalPallets = 0;
    let maxPalletHeight = 0;
    let palletType = null;
    let isStacked = false;
    
    if (cargoType === 'individual') {
        const stackingInfo = calculateStacking();
        totalWeight = stackingInfo.totalWeight;
        totalPallets = stackingInfo.effectivePallets;
        maxPalletHeight = stackingInfo.maxPalletHeight;
        isStacked = stackingInfo.isStacked;
    } else {
        const stackingInfo = calculateStandardStacking();
        totalWeight = stackingInfo.totalWeight;
        totalPallets = stackingInfo.effectivePallets;
        maxPalletHeight = stackingInfo.maxPalletHeight;
        palletType = document.querySelector('.pallet-type-btn.active').getAttribute('data-type');
        isStacked = stackingInfo.isStacked;
    }
    
    return {
        totalWeight,
        totalPallets,
        maxPalletHeight,
        palletType,
        isStacked
    };
}

// Валидация данных о грузе
function isValidCargoData(cargoData) {
    const { totalWeight, totalPallets, maxPalletHeight } = cargoData;
    
    // Базовая валидация данных
    if (totalWeight <= 0 || totalPallets <= 0 || maxPalletHeight <= 0) {
        return false;
    }
    
    // Проверка выбран ли тип груза
    const cargoTypeBtn = document.querySelector('.cargo-type-btn.active');
    if (!cargoTypeBtn) return false;
    
    // Для стандартных паллет проверяем выбран ли тип
    if (cargoTypeBtn.getAttribute('data-type') === 'standard') {
        const palletTypeBtn = document.querySelector('.pallet-type-btn.active');
        if (!palletTypeBtn) return false;
    }
    
    // Данные о местоположении
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    
    return fromLocation && toLocation && fromLocation.trim() && toLocation.trim();
}

// Система уведомлений
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Модальные окна
function openModal(source) {
    showNotification('📧 Angebotsanfrage-Funktion wird demnächst implementiert', 'info');
}

function closeModal() {
    // Будет реализовано позже
}

// Запуск приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Глобальные функции для HTML onclick
window.openModal = openModal;
window.closeModal = closeModal;
window.duplicatePallet = duplicatePallet;
window.removePallet = removePallet;