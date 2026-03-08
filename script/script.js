const allBtn = document.getElementById('allbtn')
const openBtn = document.getElementById('openbtn')
const closedbtn = document.getElementById('closedbtn')

const TotalCounts = document.getElementById('TotalCount')

//card
const cardContainer = document.getElementById('card-container');
const cardModal = document.getElementById('cardModal')
let allData = [];

//modal
const title = document.getElementById('title')
const status = document.getElementById('status')
const description = document.getElementById('description')
const priority = document.getElementById('priority')
const assignee = document.getElementById('assignee')
const updatedAt = document.getElementById('updatedAt')
const openBy = document.getElementById('openBy')

const loading = document.getElementById('loadingo-spiner')

//calculation card
function calculation() {
    const totalCard = cardContainer.children.length;
    TotalCounts.textContent = totalCard;
}


// Toggle Button
window.onload = function () {
    toggle('allbtn')
}
function toggle(id) {
    allBtn.classList.remove('btn-primary')
    openBtn.classList.remove('btn-primary')
    closedbtn.classList.remove('btn-primary')

    const selected = document.getElementById(id)
    selected.classList.add('btn-primary')

    let filterData = allData;
    console.log(filterData)
    if (id === 'openbtn') {
        showloading()
        filterData = allData.filter(card =>
            card.status.toLowerCase() === 'open'
        );
    }

    if (id === 'closedbtn') {
        showloading()
        filterData = allData.filter(card =>
            card.status.toLowerCase() === 'closed'
        );
    }

    displayCard(filterData);
    hiddenloading()
}

//loading spiner
function showloading() {
    loading.classList.remove('hidden')
}
function hiddenloading() {
    loading.classList.add('hidden')
}

//labels
const labelColors = {
    bug: "bg-red-100 text-red-600",
    enhancement: "bg-green-100 text-green-600",
    documentation: "bg-blue-100 text-blue-600",
    "help wanted": "bg-yellow-100 text-yellow-600"
};
const labelElement = (arr) => {
    return arr.map(label => {
        const color = labelColors[label] || "bg-purple-100 text-purple-600";

        return `
        <span class="badge ${color} uppercase text-sm px-3 py-1">
            ${label}
        </span>
        `
    }).join(" ");
}

//priority color
const priorityColors = {
    high: {
        bg: "bg-red-200 text-red-600",
        border: "border-t-red-500"
    },
    medium: {
        bg: "bg-yellow-200 text-yellow-600",
        border: "border-t-yellow-500"
    },
    low: {
        bg: "bg-purple-200 text-purple-600",
        border: "border-t-purple-500"
    }
};



//card section
async function CardSection() {
    showloading()
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    allData = data.data
    displayCard(allData)
}
CardSection()

//card display
function displayCard(data) {

    cardContainer.innerHTML = "";

    data.forEach((card) => {

        const isClosedLow = (card.status.toLowerCase() === "open");
        const statusIcon = isClosedLow
            ? "./assets/Open-Status.png"
            : "./assets/Closed-Status.png";

        const borderColor = isClosedLow
            ? "border-t-4 border-t-green-500"
            : "border-t-4 border-t-purple-500";

        const badgeColor = priorityColors[card.priority] ? priorityColors[card.priority].bg : "bg-gray-200 text-gray-600";

        const div = document.createElement('div')
        div.className = `border border-gray-300 rounded-lg px-3 py-2 space-y-7 hover:shadow-xl cursor-pointer ${borderColor}`;
        div.onclick = () => openModal(card.id);

        div.innerHTML = `
            <div class="flex justify-between">
                <img src="${statusIcon}" alt="${card.status}">
                <p class="font-bold rounded-2xl px-5 py-1 uppercase ${badgeColor}">
                    ${card.priority}
                </p>
            </div>

            <p class="text-xl font-bold line-clamp-1">${card.title}</p>
            <p class="text-gray-500 line-clamp-2">${card.description}</p>

            <div class="flex gap-3">
                ${labelElement(card.labels)}
            </div>

            <div class="border-t mt-5 ${borderColor}">
                <div class="mt-5 space-y-4">
                    <p>#${card.id} by ${card.author}</p>
                    <p>${new Date(card.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;

        cardContainer.appendChild(div);
    });

    calculation();
    hiddenloading();
}

//modal
async function openModal(cardId) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${cardId}`)
    const data = await res.json()
    const detailsData = data.data

    title.textContent = detailsData.title;
    description.textContent = detailsData.description;
    assignee.textContent = `${detailsData.assignee ? detailsData.assignee : 'shanto sharma'}`;
    status.textContent = detailsData.status;
    priority.textContent = detailsData.priority;
    updatedAt.textContent = `${new Date(detailsData.createdAt).toLocaleDateString()}`;
    openBy.textContent = `${detailsData.assignee ? detailsData.assignee : 'shanto sharma'}`

    cardModal.showModal()
}

//search
document.getElementById('searchBtn').addEventListener('click', async () => {
    const input = document.getElementById('inputBtn');
    const inputValue = input.value.trim().toLowerCase();
    console.log("Search Text:", inputValue);

    if (!inputValue) return alert('Place input a value');


    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputValue}`);
    const data = await res.json();
    const alldata = data.data
    console.log("Search Result:", data);

    if (alldata && alldata.length > 0) {
        displayCard(alldata);
    } else {
        cardContainer.innerHTML = `<p class="text-center text-red-500 py-10 text-3xl ">No results found for "${inputValue}"</p>`;
    }
}
);
//Enter press to search
document.getElementById('inputBtn').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('searchBtn').click()
        }
    })


