// Wardrobe Dashboard App
document.addEventListener('DOMContentLoaded', () => {
    const items = wardrobeData.items;
    
    // Color map for color dots
    const colorMap = {
        'black': '#1a1a1a',
        'white': '#ffffff',
        'cream': '#f5f5dc',
        'gray': '#808080',
        'charcoal': '#36454f',
        'navy': '#000080',
        'blue': '#4169e1',
        'light-blue': '#87ceeb',
        'olive': '#808000',
        'green': '#228b22',
        'beige': '#d4b896',
        'camel': '#c19a6b',
        'brown': '#8b4513',
        'burgundy': '#800020',
        'coral': '#ff7f50'
    };
    
    // Category groupings
    const categoryGroups = {
        tops: ['t-shirt', 'polo', 'long-sleeve-shirt', 'sweater', 'hoodie', 'cardigan', 'quarter-zip', 'sweatshirt', 'henley', 'shirt'],
        bottoms: ['jeans', 'pants', 'chinos', 'joggers', 'sweatpants'],
        outerwear: ['jacket', 'coat', 'blazer', 'shacket'],
        footwear: ['sneakers', 'boots', 'loafers', 'oxford-shoes', 'sandals']
    };
    
    // Image base path
    const imgBasePath = '../clothing-pics/';
    
    // Initialize
    init();
    
    function init() {
        populateBrandFilter();
        renderWardrobe(items);
        setupFilters();
        setupNavigation();
        setupModal();
        setupOutfitBuilder();
        renderStats();
    }
    
    // Populate brand filter dropdown
    function populateBrandFilter() {
        const brands = [...new Set(items.map(i => i.brand).filter(Boolean))].sort();
        const select = document.getElementById('filter-brand');
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
        });
    }
    
    // Render wardrobe grid
    function renderWardrobe(filteredItems) {
        const grid = document.getElementById('wardrobe-grid');
        grid.innerHTML = '';
        
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'wardrobe-item';
            div.dataset.id = item.id;
            
            div.innerHTML = `
                <img src="${imgBasePath}${item.image}" alt="${item.brand || 'Clothing item'}" loading="lazy">
                <div class="wardrobe-item-info">
                    <div class="wardrobe-item-brand">${item.brand || 'Unknown'}</div>
                    <div class="wardrobe-item-meta">
                        <span class="wardrobe-item-color">
                            <span class="color-dot" style="background-color: ${colorMap[item.color] || '#ccc'}"></span>
                            ${item.color || ''}
                        </span>
                        <span>${formatCategory(item.category)}</span>
                    </div>
                </div>
            `;
            
            div.addEventListener('click', () => showModal(item));
            grid.appendChild(div);
        });
        
        document.getElementById('results-count').textContent = `Showing ${filteredItems.length} items`;
    }
    
    // Format category name
    function formatCategory(cat) {
        if (!cat) return '';
        return cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Setup filters
    function setupFilters() {
        const categoryFilter = document.getElementById('filter-category');
        const colorFilter = document.getElementById('filter-color');
        const brandFilter = document.getElementById('filter-brand');
        const styleFilter = document.getElementById('filter-style');
        const clearBtn = document.getElementById('clear-filters');
        
        const applyFilters = () => {
            let filtered = items;
            
            if (categoryFilter.value) {
                filtered = filtered.filter(i => i.category === categoryFilter.value);
            }
            if (colorFilter.value) {
                filtered = filtered.filter(i => i.color === colorFilter.value);
            }
            if (brandFilter.value) {
                filtered = filtered.filter(i => i.brand === brandFilter.value);
            }
            if (styleFilter.value) {
                filtered = filtered.filter(i => i.style && i.style.includes(styleFilter.value));
            }
            
            renderWardrobe(filtered);
        };
        
        categoryFilter.addEventListener('change', applyFilters);
        colorFilter.addEventListener('change', applyFilters);
        brandFilter.addEventListener('change', applyFilters);
        styleFilter.addEventListener('change', applyFilters);
        
        clearBtn.addEventListener('click', () => {
            categoryFilter.value = '';
            colorFilter.value = '';
            brandFilter.value = '';
            styleFilter.value = '';
            renderWardrobe(items);
        });
    }
    
    // Navigation
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewId = item.dataset.view + '-view';
                
                navItems.forEach(n => n.classList.remove('active'));
                views.forEach(v => v.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(viewId).classList.add('active');
            });
        });
    }
    
    // Modal
    function setupModal() {
        const modal = document.getElementById('item-modal');
        const closeBtn = modal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    function showModal(item) {
        const modal = document.getElementById('item-modal');
        document.getElementById('modal-image').src = imgBasePath + item.image;
        document.getElementById('modal-brand').textContent = item.brand || 'Unknown Brand';
        document.getElementById('modal-category').textContent = formatCategory(item.category);
        
        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        
        if (item.color) {
            const colorTag = document.createElement('span');
            colorTag.className = 'modal-tag';
            colorTag.innerHTML = `<span class="color-dot" style="background-color: ${colorMap[item.color] || '#ccc'}; display: inline-block; margin-right: 4px; vertical-align: middle;"></span>${item.color}`;
            tagsContainer.appendChild(colorTag);
        }
        
        if (item.style) {
            item.style.forEach(s => {
                const tag = document.createElement('span');
                tag.className = 'modal-tag';
                tag.textContent = s;
                tagsContainer.appendChild(tag);
            });
        }
        
        modal.classList.add('active');
    }
    
    // Outfit Builder
    function setupOutfitBuilder() {
        const pickerGrid = document.getElementById('picker-grid');
        const pickerCategory = document.getElementById('picker-category');
        const slots = document.querySelectorAll('.slot-drop');
        const currentOutfit = {};
        
        // Render picker items
        function renderPicker(filter = '') {
            pickerGrid.innerHTML = '';
            
            let filteredItems = items;
            if (filter) {
                const categories = categoryGroups[filter] || [];
                filteredItems = items.filter(i => categories.includes(i.category));
            }
            
            filteredItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'picker-item';
                div.draggable = true;
                div.dataset.id = item.id;
                div.dataset.category = item.category;
                
                div.innerHTML = `<img src="${imgBasePath}${item.image}" alt="${item.brand}">`;
                
                div.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(item));
                    div.classList.add('dragging');
                });
                
                div.addEventListener('dragend', () => {
                    div.classList.remove('dragging');
                });
                
                pickerGrid.appendChild(div);
            });
        }
        
        renderPicker();
        
        pickerCategory.addEventListener('change', (e) => {
            renderPicker(e.target.value);
        });
        
        // Setup drop zones
        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                const item = JSON.parse(e.dataTransfer.getData('text/plain'));
                const acceptedCategories = slot.dataset.accept.split(',');
                
                if (acceptedCategories.includes(item.category)) {
                    slot.innerHTML = `<img src="${imgBasePath}${item.image}" alt="${item.brand}">`;
                    slot.classList.add('filled');
                    currentOutfit[slot.parentElement.dataset.slot] = item;
                }
            });
        });
        
        // Clear outfit
        document.getElementById('clear-outfit').addEventListener('click', () => {
            slots.forEach(slot => {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            });
            Object.keys(currentOutfit).forEach(k => delete currentOutfit[k]);
        });
        
        // Random outfit
        document.getElementById('random-outfit').addEventListener('click', () => {
            const tops = items.filter(i => categoryGroups.tops.includes(i.category));
            const bottoms = items.filter(i => categoryGroups.bottoms.includes(i.category));
            const footwear = items.filter(i => categoryGroups.footwear.includes(i.category));
            const outerwear = items.filter(i => categoryGroups.outerwear.includes(i.category));
            
            const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
            
            const outfit = {
                top: randomItem(tops),
                bottom: randomItem(bottoms),
                footwear: randomItem(footwear),
                outerwear: Math.random() > 0.5 ? randomItem(outerwear) : null
            };
            
            slots.forEach(slot => {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            });
            
            Object.entries(outfit).forEach(([slotName, item]) => {
                if (!item) return;
                const slotEl = document.querySelector(`[data-slot="${slotName}"] .slot-drop`);
                if (slotEl) {
                    slotEl.innerHTML = `<img src="${imgBasePath}${item.image}" alt="${item.brand}">`;
                    slotEl.classList.add('filled');
                    currentOutfit[slotName] = item;
                }
            });
        });
        
        // Save outfit
        document.getElementById('save-outfit').addEventListener('click', () => {
            const outfitItems = Object.values(currentOutfit);
            if (outfitItems.length < 2) {
                alert('Add at least 2 items to save an outfit');
                return;
            }
            
            const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
            savedOutfits.push({
                id: Date.now(),
                items: outfitItems.map(i => i.id),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
            
            renderSavedOutfits();
            alert('Outfit saved!');
        });
        
        renderSavedOutfits();
    }
    
    function renderSavedOutfits() {
        const container = document.getElementById('saved-outfits-grid');
        const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
        
        if (savedOutfits.length === 0) {
            container.innerHTML = '<p class="empty-state">No saved outfits yet. Create your first outfit above!</p>';
            return;
        }
        
        container.innerHTML = '';
        savedOutfits.forEach(outfit => {
            const outfitItems = outfit.items.map(id => items.find(i => i.id === id)).filter(Boolean);
            
            const div = document.createElement('div');
            div.className = 'saved-outfit-card';
            div.style.cssText = 'background: var(--bg-card); border-radius: var(--radius-md); padding: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;';
            
            outfitItems.slice(0, 4).forEach(item => {
                const img = document.createElement('img');
                img.src = imgBasePath + item.image;
                img.style.cssText = 'width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px;';
                div.appendChild(img);
            });
            
            container.appendChild(div);
        });
    }
    
    // Stats
    function renderStats() {
        renderCategoryChart();
        renderColorChart();
        renderBrandChart();
        renderStyleChart();
    }
    
    function renderCategoryChart() {
        const container = document.getElementById('chart-category');
        const counts = {};
        
        items.forEach(item => {
            const cat = formatCategory(item.category);
            counts[cat] = (counts[cat] || 0) + 1;
        });
        
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const max = Math.max(...sorted.map(s => s[1]));
        
        container.innerHTML = sorted.map(([cat, count]) => `
            <div class="chart-row">
                <span class="chart-label">${cat}</span>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(count / max) * 100}%"></div>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');
    }
    
    function renderColorChart() {
        const container = document.getElementById('chart-color');
        const counts = {};
        
        items.forEach(item => {
            if (item.color) {
                counts[item.color] = (counts[item.color] || 0) + 1;
            }
        });
        
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        
        container.innerHTML = sorted.map(([color, count]) => `
            <div class="color-item">
                <span class="color-swatch" style="background-color: ${colorMap[color] || '#ccc'}"></span>
                <span class="color-name">${color}</span>
                <span class="color-count">${count}</span>
            </div>
        `).join('');
    }
    
    function renderBrandChart() {
        const container = document.getElementById('chart-brand');
        const counts = {};
        
        items.forEach(item => {
            if (item.brand) {
                counts[item.brand] = (counts[item.brand] || 0) + 1;
            }
        });
        
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const max = Math.max(...sorted.map(s => s[1]));
        
        container.innerHTML = sorted.map(([brand, count]) => `
            <div class="chart-row">
                <span class="chart-label">${brand}</span>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(count / max) * 100}%"></div>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');
    }
    
    function renderStyleChart() {
        const container = document.getElementById('chart-style');
        const counts = {};
        
        items.forEach(item => {
            if (item.style) {
                item.style.forEach(s => {
                    counts[s] = (counts[s] || 0) + 1;
                });
            }
        });
        
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const max = Math.max(...sorted.map(s => s[1]));
        
        container.innerHTML = sorted.map(([style, count]) => `
            <div class="chart-row">
                <span class="chart-label">${style}</span>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(count / max) * 100}%"></div>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');
    }
});
