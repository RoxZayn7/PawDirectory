/* ============ 1. THE SERVICES ============ */
/* To add a service: copy one { ... } block and change the words.
    To change a price: just change the number.
   "emoji" is the big picture on the card — pick any emoji you like. */

var SERVICES = [
    { id: 1, name: "Blue Ridge Pet Hostel", cat: "boarding", pets: ["dog", "cat"],
    price: 45, unit: "per night", rating: 4.9, reviews: 312, area: "Arden",
    emoji: "🏠", color: "#DDF2EC",
    desc: "A cozy mountain hostel for pets with big sunny play yards and comfy private suites for overnight stays.",
    tags: ["Overnight stays", "Group play"], phone: "8285550142", email: "stay@blueridgepethostel.example" },

    { id: 2, name: "Suds & Snouts Grooming", cat: "grooming", pets: ["dog", "cat"],
    price: 35, unit: "per groom", rating: 4.8, reviews: 208, area: "Asheville",
    emoji: "✂️", color: "#FBE0E8",
    desc: "Baths, haircuts, nail trims and de-shedding — your pet leaves looking (and smelling) great.",
    tags: ["Bath & blow-dry", "Nail trim"], phone: "8285550117", email: "hello@sudsandsnouts.example" },

    { id: 3, name: "Happy Paws Pet Sitting", cat: "sitting", pets: ["dog", "cat"],
    price: 30, unit: "per visit", rating: 5.0, reviews: 156, area: "Hendersonville",
    emoji: "🐾", color: "#FDEBD3",
    desc: "A trusted sitter visits your home to feed, play and cuddle your pets while you are away.",
    tags: ["Home visits", "Photo updates"], phone: "8285550163", email: "care@happypaws.example" },

    { id: 4, name: "Good Boy Dog Training", cat: "training", pets: ["dog"],
    price: 60, unit: "per session", rating: 4.9, reviews: 189, area: "Asheville",
    emoji: "🎓", color: "#E4E0FB",
    desc: "Friendly, reward-based training for puppies and adult dogs — sit, stay, recall and good manners.",
    tags: ["Puppy classes", "Recall"], phone: "8285550191", email: "train@goodboydog.example" },

    { id: 5, name: "The Pet Pantry", cat: "accessories", pets: ["dog", "cat"],
    price: 12, unit: "from", rating: 4.7, reviews: 264, area: "Arden",
    emoji: "🛍️", color: "#FDE3D9",
    desc: "Toys, treats, collars, beds and healthy food — everything your pet could want in one little shop.",
    tags: ["Toys", "Treats", "Food"], phone: "8285550138", email: "shop@thepetpantry.example" },

    { id: 6, name: "Wag More Dog Walking", cat: "walking", pets: ["dog"],
    price: 20, unit: "per walk", rating: 4.8, reviews: 341, area: "Asheville",
    emoji: "🦮", color: "#D8F0DC",
    desc: "Daily walks and playtime with a walker your dog will love — group walks or one-to-one.",
    tags: ["Group walks", "Solo walks"], phone: "8285550175", email: "walks@wagmore.example" }
];


/* ============ 2. THE CATEGORIES ============ */
/* Each category has an id (used in the data), a label (shown on the button)
   and a color. The "all" button shows everything. */

var CATEGORIES = [
    { id: "all", label: "All Services", color: "#0E7C6B" },
    { id: "boarding", label: "Pet Hostel", color: "#0E7C6B" },
    { id: "grooming", label: "Grooming", color: "#D94F70" },
    { id: "sitting", label: "Pet Sitting", color: "#E8890C" },
    { id: "training", label: "Dog Training", color: "#7A5AF8" },
    { id: "accessories", label: "Accessories", color: "#E4572E" },
    { id: "walking", label: "Walking", color: "#2E9E5B" }
];

// Find a category's label from its id (for the cards)
function catLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    }
    return id;
}


/* ============ 3. SHOW THE SERVICES ON THE PAGE ============ */

var grid = document.getElementById("grid");
var resultCount = document.getElementById("resultCount");
var emptyState = document.getElementById("emptyState");
var searchStatus = document.getElementById("searchStatus");

// What the user has picked right now (search word, category, pet)
var state = { q: "", cat: "all", pet: "all" };

// Turn 4.9 into ★★★★★ (full stars only, rounded down)
function stars(rating) {
    var full = Math.floor(rating);
    var out = "";
    for (var i = 0; i < full; i++) out += "★";
    return out;
}

// Build one card's HTML from one service
function cardHTML(s) {
    return '' +
    '<article class="card">' +
        '<div class="emoji-box" style="--c:' + s.color + '">' + s.emoji + '</div>' +
        '<div class="card-body">' +
        '<h3>' + s.name + '</h3>' +
        '<div class="rating-row"><span class="stars">' + stars(s.rating) + '</span>' +
        '<span>' + s.rating.toFixed(1) + '</span>' +
        '<span class="rev">(' + s.reviews + ' reviews)</span></div>' +
        '<p class="desc">' + s.desc + '</p>' +
        '<div class="meta-row"><span>📍 ' + s.area + '</span><span>' + catLabel(s.cat) + '</span></div>' +
        '<div class="tags">' + s.tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' +
        '<div class="card-foot">' +
        '<div class="price"><b>$' + s.price + '</b> <span>' + s.unit + '</span></div>' +
        '<button class="details-btn" data-details="' + s.id + '" type="button">View details</button>' +
        '</div>' +
    '</div>' +
    '</article>';
}

// Show a list of services (and the "no matches" box when the list is empty)
function render(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) html += cardHTML(list[i]);
    grid.innerHTML = html;
    resultCount.textContent = list.length + (list.length === 1 ? " service" : " services");
    emptyState.classList.toggle("show", list.length === 0);
}

// Does this service match what the user picked?
function matches(s) {
  // 1. Search word: look in the name, description, area and tags
    var q = state.q.trim().toLowerCase();
    if (q) {
    var text = (s.name + " " + s.desc + " " + s.area + " " + s.tags.join(" ")).toLowerCase();
    if (text.indexOf(q) === -1) return false;
    }
  // 2. Category button
    if (state.cat !== "all" && s.cat !== state.cat) return false;
  // 3. Pet filter
    if (state.pet !== "all" && s.pets.indexOf(state.pet) === -1) return false;
    return true;
}

// Re-run the filters and show the result
function refresh() {
    var list = [];
    for (var i = 0; i < SERVICES.length; i++) {
    if (matches(SERVICES[i])) list.push(SERVICES[i]);
    }
    render(list);
    searchStatus.textContent = state.q
    ? 'Results for "' + state.q + '"'
    : "Showing all services";
}


/* ============ 4. SEARCH BOX ============ */

var searchInput = document.getElementById("searchInput");
var clearBtn = document.getElementById("clearSearch");

searchInput.addEventListener("input", function() {
    clearBtn.classList.toggle("show", searchInput.value.length > 0);
    state.q = searchInput.value;
    refresh();
});

clearBtn.addEventListener("click", function() {
    searchInput.value = "";
    state.q = "";
    clearBtn.classList.remove("show");
    refresh();
    searchInput.focus();
});


/* ============ 5. CATEGORY BUTTONS ============ */

var catChips = document.getElementById("catChips");

// Make one button per category, with a count of how many services it has
function buildChips() {
    var html = "";
    for (var i = 0; i < CATEGORIES.length; i++) {
    var c = CATEGORIES[i];
    var count = c.id === "all" ? SERVICES.length : SERVICES.filter(function(s) { return s.cat === c.id; }).length;
    html += '<button class="cat-chip' + (state.cat === c.id ? " active" : "") + '" data-cat="' + c.id + '" type="button">' +
            c.label + ' <span class="cnt">' + count + '</span></button>';
    }
    catChips.innerHTML = html;
}

catChips.addEventListener("click", function(e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.getAttribute("data-cat");
    buildChips();
    refresh();
});


/* ============ 6. PET FILTER + RESET ============ */

document.getElementById("petFilters").addEventListener("click", function(e) {
    var btn = e.target.closest("[data-pet]");
    if (!btn) return;
    var all = document.querySelectorAll("#petFilters .f-btn");
    for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
    btn.classList.add("active");
    state.pet = btn.getAttribute("data-pet");
    refresh();
});

function resetAll() {
    state = { q: "", cat: "all", pet: "all" };
    searchInput.value = "";
    clearBtn.classList.remove("show");
    var all = document.querySelectorAll("#petFilters .f-btn");
    for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
    document.querySelector('#petFilters [data-pet="all"]').classList.add("active");
    buildChips();
    refresh();
}

document.getElementById("resetAll").addEventListener("click", resetAll);
document.getElementById("emptyReset").addEventListener("click", resetAll);


/* ============ 7. DETAILS POPUP ============ */

var modalBack = document.getElementById("modalBack");
var modalBody = document.getElementById("modalBody");

function openModal(id) {
    var s = null;
    for (var i = 0; i < SERVICES.length; i++) {
    if (SERVICES[i].id === id) s = SERVICES[i];
    }
    if (!s) return;
    modalBody.innerHTML =
    '<div class="m-emoji">' + s.emoji + '</div>' +
    '<h3>' + s.name + '</h3>' +
    '<div class="rating-row"><span class="stars">' + stars(s.rating) + '</span>' +
    '<span>' + s.rating.toFixed(1) + '</span>' +
    '<span class="rev">(' + s.reviews + ' reviews)</span></div>' +
    '<p class="desc">' + s.desc + '</p>' +
    '<div class="meta-row"><span>📍 ' + s.area + '</span><span>' + catLabel(s.cat) + '</span></div>' +
    '<div class="card-foot">' +
    '<div class="price"><b>$' + s.price + '</b> <span>' + s.unit + '</span></div>' +
    '</div>' +
    '<div class="m-actions">' +
    '<a class="call" href="tel:' + s.phone + '">📞 Call</a>' +
    '<a class="mail" href="mailto:' + s.email + '">✉️ Email</a>' +
    '</div>';
    modalBack.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modalBack.classList.remove("open");
    document.body.style.overflow = "";
}

// "View details" buttons live inside the grid
grid.addEventListener("click", function(e) {
    var btn = e.target.closest("[data-details]");
    if (btn) openModal(parseInt(btn.getAttribute("data-details"), 10));
});

document.getElementById("mClose").addEventListener("click", closeModal);
modalBack.addEventListener("click", function(e) { if (e.target === modalBack) closeModal(); });
document.addEventListener("keydown", function(e) { if (e.key === "Escape") closeModal(); });


/* ============================================================
    8. PAW BACKGROUND — copied exactly from the first site
   ============================================================ */
(function() {
    var field = document.getElementById('pawField');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var colors = ['var(--teal)','var(--amber)','var(--coral)','var(--pink)'];
    var N = reduced ? 8 : 16;
    for (var i=0;i<N;i++){
    var el = document.createElement('span');
    el.className = 'paw-float';
    var size = 18 + Math.random() * 30;
    el.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor"><path d="M12 13.2c2.9 0 5.8 2.3 5.8 4.9 0 1.6-1.2 2.7-2.9 2.7-1 0-1.8-.4-2.9-.4s-1.9.4-2.9.4c-1.7 0-2.9-1.1-2.9-2.7 0-2.6 2.9-4.9 5.8-4.9ZM6.2 8.6c1.1.3 1.7 1.7 1.3 3.1-.4 1.4-1.6 2.3-2.7 2-1.1-.3-1.7-1.7-1.3-3.1.4-1.4 1.6-2.3 2.7-2Zm11.6 0c1.1-.3 2.3.6 2.7 2 .4 1.4-.2 2.8-1.3 3.1-1.1.3-2.3-.6-2.7-2-.4-1.4.2-2.8 1.3-3.1ZM9.3 3.6c1.2.1 2 1.4 1.9 2.9-.1 1.5-1.1 2.6-2.3 2.5-1.2-.1-2-1.4-1.9-2.9.1-1.5 1.1-2.6 2.3-2.5Zm5.4 0c1.2-.1 2.2 1 2.3 2.5.1 1.5-.7 2.8-1.9 2.9-1.2.1-2.2-1-2.3-2.5-.1-1.5.7-2.8 1.9-2.9Z"/></svg>';
    el.style.left = (Math.random() * 96) + 'vw';
    el.style.color = colors[i % colors.length];
    el.style.setProperty('--rot', (Math.random() * 50 - 25) + 'deg');
    el.style.setProperty('--sway', (14 + Math.random() * 30) + 'px');
    el.style.setProperty('--o', (0.07 + Math.random() * 0.09).toFixed(2));
    el.style.animationDuration = (16 + Math.random() * 18) + 's';
    el.style.animationDelay = (-Math.random() * 30) + 's';
    if (reduced){ el.style.bottom = 'auto'; el.style.top = (Math.random() * 92) + 'vh'; }
    field.appendChild(el);
    }
  /* click = paw pop */
    if (!reduced){
    document.addEventListener('pointerdown', function(e){
        if (e.target.closest('input, select, textarea')) return;
        var pop = document.createElement('span');
        pop.className = 'paw-pop';
        pop.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 13.2c2.9 0 5.8 2.3 5.8 4.9 0 1.6-1.2 2.7-2.9 2.7-1 0-1.8-.4-2.9-.4s-1.9.4-2.9.4c-1.7 0-2.9-1.1-2.9-2.7 0-2.6 2.9-4.9 5.8-4.9ZM6.2 8.6c1.1.3 1.7 1.7 1.3 3.1-.4 1.4-1.6 2.3-2.7 2-1.1-.3-1.7-1.7-1.3-3.1.4-1.4 1.6-2.3 2.7-2Zm11.6 0c1.1-.3 2.3.6 2.7 2 .4 1.4-.2 2.8-1.3 3.1-1.1.3-2.3-.6-2.7-2-.4-1.4.2-2.8 1.3-3.1ZM9.3 3.6c1.2.1 2 1.4 1.9 2.9-.1 1.5-1.1 2.6-2.3 2.5-1.2-.1-2-1.4-1.9-2.9.1-1.5 1.1-2.6 2.3-2.5Zm5.4 0c1.2-.1 2.2 1 2.3 2.5.1 1.5-.7 2.8-1.9 2.9-1.2.1-2.2-1-2.3-2.5-.1-1.5.7-2.8 1.9-2.9Z"/></svg>';
        pop.style.left = (e.clientX - 15) + 'px';
        pop.style.top = (e.clientY - 15) + 'px';
        pop.style.color = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(pop);
        setTimeout(function(){ pop.remove(); }, 950);
    });
    }
})();


/* ============ 9. START THE PAGE ============ */
document.getElementById('statCount').textContent = SERVICES.length;
buildChips();
render(SERVICES);