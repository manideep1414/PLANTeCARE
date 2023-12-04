addEventListener('DOMContentLoaded', function () {
    const plantList = document.getElementById('plantList');
    const modal = document.getElementById('modal');
    const addForm = document.getElementById('addForm');
    const notification = document.getElementById('notification');

    let plants = getPlantsFromLocalStorage();

    plants.forEach(plant => {
        createPlantCard(plant);
    });

    function createPlantCard(plant) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = plant.id;

        card.innerHTML = `<h3>${plant.name}</h3>
                    <p>Watering Schedule: ${plant.wateringSchedule} days</p>
                    <p>Last Watered: ${formatDate(plant.lastWatered)}</p>
                    <p>Next Watering: ${calculateNextWatering(plant)} days</p>`;

        const progressDiv = document.createElement('div');
        progressDiv.classList.add('progress');

        const wateredDiv = document.createElement('div');
        wateredDiv.classList.add('watered');
        wateredDiv.style.width = `${plant.progress}%`;

        progressDiv.appendChild(wateredDiv);
        card.appendChild(progressDiv);

        const deleteButton = createButton('Delete', () => deletePlant(plant.id));
        card.appendChild(deleteButton);

        card.addEventListener('click', () => openEditModal(plant.id));

        plantList.appendChild(card);
    }

    function createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.innerText = text;
        button.addEventListener('click', clickHandler);
        return button;
    }

    window.openAddModal = function () {
        modal.style.display = 'block';
    }

    window.closeAddModal = function () {
        modal.style.display = 'none';
    }

    window.addPlant = function () {
        const plantName = document.getElementById('plantName').value;
        const wateringSchedule = parseInt(document.getElementById('wateringSchedule').value);

        if (plantName && !isNaN(wateringSchedule) && wateringSchedule > 0) {
            const newPlant = {
                id: Date.now(),
                name: plantName,
                wateringSchedule: wateringSchedule,
                progress: 0,
                lastWatered: Date.now(),
            };

            plants.push(newPlant);
            savePlantsToLocalStorage();
            createPlantCard(newPlant);
            closeAddModal();
            clearForm();

            showNotification('Plant added successfully!');
        } else {
            alert('Invalid input. Please fill out the form correctly.');
        }
    }

    function openEditModal(plantId) {
        // Add functionality to open the edit modal for a specific plant
        // You can use the plantId to identify the plant to be edited
    }

    function deletePlant(plantId) {
        const confirmDelete = confirm('Are you sure you want to delete this plant?');
        if (confirmDelete) {
            plants = plants.filter(plant => plant.id !== plantId);
            savePlantsToLocalStorage();
            refreshPlantList();
            showNotification('Plant deleted successfully!');
        }
    }

    function refreshPlantList() {
        plantList.innerHTML = '';
        plants.forEach(plant => {
            createPlantCard(plant);
        });
    }

    function showNotification(message) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function clearForm() {
    document.addForm.reset();
    }

    function savePlantsToLocalStorage() {
        localStorage.setItem('plants', JSON.stringify(plants));
    }

    function getPlantsFromLocalStorage() {
        const storedPlants = localStorage.getItem('plants');
        return storedPlants ? JSON.parse(storedPlants) : [];
    }

    function calculateNextWatering(plant) {
        const lastWateredDate = new Date(plant.lastWatered);
        const nextWateringDate = new Date(lastWateredDate);
        nextWateringDate.setDate(lastWateredDate.getDate() + plant.wateringSchedule);

        const currentDate = new Date();
        const daysUntilNextWatering = Math.ceil((nextWateringDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysUntilNextWatering === 1) {
            sendOneDayBeforeNotification(plant);
        }

        return daysUntilNextWatering;
    }

    function sendOneDayBeforeNotification(plant) {
        alert(`One day before watering: ${plant.name}`);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
});