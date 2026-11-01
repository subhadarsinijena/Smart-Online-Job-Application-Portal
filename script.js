
const jobs = [
    {id:1,title:"Frontend Developer",company:"Tech Solutions",location:"Bhubaneswar",salary:"3-5 LPA",category:"Web",skills:["HTML","CSS","JavaScript"],type:"Full Time"},
    {id:2,title:"Python Developer",company:"Digital World",location:"Bangalore",salary:"4-6 LPA",category:"Software",skills:["Python","SQL","Django"],type:"Full Time"},
    {id:3,title:"AI/ML Engineer",company:"Future Tech",location:"Hyderabad",salary:"5-8 LPA",category:"AI",skills:["Python","AI","Machine Learning"],type:"Full Time"},
    {id:4,title:"Data Analyst",company:"Data Solutions",location:"Delhi",salary:"3-5 LPA",category:"Data",skills:["SQL","Excel","Python"],type:"Full Time"},
    {id:5,title:"Web Designer",company:"Creative Studio",location:"Kolkata",salary:"2-4 LPA",category:"Web",skills:["HTML","CSS","Design"],type:"Internship"},
    {id:6,title:"Software Engineer",company:"Code Works",location:"Bhubaneswar",salary:"4-7 LPA",category:"Software",skills:["Java","Python","SQL"],type:"Full Time"}
];

const $ = id => document.getElementById(id);

function displayJobs(list) {
    $("jobContainer").innerHTML = "";
    $("resultCount").textContent = list.length + " jobs available";
    $("noResults").style.display = list.length ? "none" : "block";

    list.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
            <span class="job-category">${job.category}</span>
            <h3>${job.title}</h3>
            <p class="company-name">${job.company}</p>
            <p>📍 ${job.location}</p>
            <p>💰 ${job.salary}</p>
            <p>💼 ${job.type}</p>
            <div class="job-skills">
                ${job.skills.map(s => `<span>${s}</span>`).join("")}
            </div>
            <button class="apply-btn">Apply Now</button>
        `;
        card.querySelector("button").addEventListener("click", () => openApplyModal(job.id));
        $("jobContainer").appendChild(card);
    });
}

function normalizeCategory(value) {
    const v = value.trim().toLowerCase();
    if (v === "software development") return "software";
    if (v === "web development") return "web";
    if (v === "artificial intelligence") return "ai";
    if (v === "data analytics") return "data";
    return v;
}

function filterJobs() {
    const keyword = $("searchInput").value.trim().toLowerCase();
    const location = $("locationFilter").value.trim().toLowerCase();
    const category = normalizeCategory($("categoryFilter").value);

    const filtered = jobs.filter(job => {
        const searchable = [
            job.title, job.company, job.location,
            job.category, ...job.skills
        ].join(" ").toLowerCase();

        return searchable.includes(keyword) &&
            job.location.toLowerCase().includes(location) &&
            (!category || normalizeCategory(job.category) === category);
    });

    displayJobs(filtered);
}

$("searchButton").addEventListener("click", filterJobs);
$("searchInput").addEventListener("keydown", e => {
    if (e.key === "Enter") filterJobs();
});
$("locationFilter").addEventListener("keydown", e => {
    if (e.key === "Enter") filterJobs();
});
$("categoryFilter").addEventListener("change", filterJobs);

$("resetButton").addEventListener("click", () => {
    $("searchInput").value = "";
    $("locationFilter").value = "";
    $("categoryFilter").value = "";
    displayJobs(jobs);
});

// Category buttons, if added later
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        $("categoryFilter").value = button.dataset.category;
        filterJobs();
    });
});

// Skill matching
$("matchButton").addEventListener("click", () => {
    const skills = $("skillsInput").value.toLowerCase()
        .split(",").map(s => s.trim()).filter(Boolean);

    if (!skills.length) {
        $("matchResult").innerHTML = "<p>Please enter your skills.</p>";
        return;
    }

    const matched = jobs.map(job => {
        const found = job.skills.filter(s => skills.includes(s.toLowerCase()));
        return {job, found, score: Math.round(found.length / job.skills.length * 100)};
    }).filter(item => item.found.length)
      .sort((a,b) => b.score - a.score);

    if (!matched.length) {
        $("matchResult").innerHTML = "<p>No matching jobs found. Try other skills.</p>";
        return;
    }

    $("matchResult").innerHTML = "<h3>Recommended Jobs</h3>" +
        matched.map(item => `
            <div class="match-card">
                <h4>${item.job.title}</h4>
                <p>${item.job.company} - ${item.job.location}</p>
                <p>Skill Match: ${item.score}%</p>
                <p>Matched: ${item.found.join(", ")}</p>
                <button onclick="openApplyModal(${item.job.id})">Apply Now</button>
            </div>
        `).join("");
});

// Registration and login demo
let authMode = "register";

function openAuthModal(mode = "register") {
    authMode = mode;
    $("authModal").style.display = "flex";
    $("authTitle").textContent = mode === "register" ? "Register" : "Login";
    $("authSubmit").textContent = mode === "register" ? "Register" : "Login";
    $("authName").style.display = mode === "register" ? "block" : "none";
    $("authMessage").textContent = "";
}

function closeAuthModal() {
    $("authModal").style.display = "none";
}

function switchAuthMode() {
    openAuthModal(authMode === "register" ? "login" : "register");
}

window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;

$("userButton").addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("jobPortalUser") || "null");
    if (user) {
        if (confirm("Do you want to logout?")) {
            localStorage.removeItem("jobPortalUser");
            updateUserButton();
            alert("Logged out!");
        }
    } else {
        openAuthModal("register");
    }
});

$("authForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = $("authName").value.trim();
    const email = $("authEmail").value.trim().toLowerCase();
    const password = $("authPassword").value;

    if (authMode === "register") {
        if (!name) {
            $("authMessage").textContent = "Enter your name.";
            return;
        }
        localStorage.setItem("jobPortalUser", JSON.stringify({name,email,password}));
        $("authMessage").textContent = "Registration successful!";
    } else {
        const user = JSON.parse(localStorage.getItem("jobPortalUser") || "null");
        if (!user || user.email !== email || user.password !== password) {
            $("authMessage").textContent = "Invalid login. Please register first.";
            return;
        }
        $("authMessage").textContent = "Login successful!";
    }

    updateUserButton();
    setTimeout(closeAuthModal, 1000);
});

function updateUserButton() {
    const user = JSON.parse(localStorage.getItem("jobPortalUser") || "null");
    $("userButton").textContent = user ? "Welcome, " + user.name : "Login / Register";
}

// Apply for a job
let currentJob = null;

function openApplyModal(id) {
    currentJob = jobs.find(job => job.id === id);
    if (!currentJob) return;

    $("selectedJob").textContent = "Applying for: " + currentJob.title;
    $("applyMessage").textContent = "";

    const user = JSON.parse(localStorage.getItem("jobPortalUser") || "null");
    if (user) {
        $("appName").value = user.name;
        $("appEmail").value = user.email;
    }

    $("applyModal").style.display = "flex";
}

function closeApplyModal() {
    $("applyModal").style.display = "none";
}

window.openApplyModal = openApplyModal;
window.closeApplyModal = closeApplyModal;

$("applyForm").addEventListener("submit", e => {
    e.preventDefault();

    if (!currentJob) return;

    const file = $("resume").files[0];
    if (!file) {
        $("applyMessage").textContent = "Please upload your PDF resume.";
        return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
        $("applyMessage").textContent = "Only PDF files are accepted.";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        $("applyMessage").textContent = "PDF must be smaller than 2 MB.";
        return;
    }

    const application = {
        jobTitle: currentJob.title,
        company: currentJob.company,
        name: $("appName").value.trim(),
        email: $("appEmail").value.trim(),
        phone: $("appPhone").value.trim(),
        skills: $("appSkills").value.trim(),
        resume: file.name,
        date: new Date().toLocaleDateString()
    };

    const applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    applications.push(application);
    localStorage.setItem("jobApplications", JSON.stringify(applications));

    $("applyMessage").textContent = "Application submitted successfully!";
    displayApplications();

    setTimeout(() => {
        closeApplyModal();
        $("applyForm").reset();
    }, 1200);
});

// My applications
function displayApplications() {
    const applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");

    if (!applications.length) {
        $("applicationList").innerHTML = "<p>You have not applied for any jobs yet.</p>";
        return;
    }

    $("applicationList").innerHTML = applications.map((app, index) => `
        <div class="application-card">
            <h3>${app.jobTitle}</h3>
            <p>Company: ${app.company}</p>
            <p>Name: ${app.name}</p>
            <p>Application Date: ${app.date}</p>
            <p>Status: Submitted</p>
            <button onclick="deleteApplication(${index})">Remove</button>
        </div>
    `).join("");
}

function deleteApplication(index) {
    const applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    applications.splice(index, 1);
    localStorage.setItem("jobApplications", JSON.stringify(applications));
    displayApplications();
}

window.deleteApplication = deleteApplication;

// Close modals when clicking outside
window.addEventListener("click", e => {
    if (e.target === $("authModal")) closeAuthModal();
    if (e.target === $("applyModal")) closeApplyModal();
});

// Start website
displayJobs(jobs);
displayApplications();
updateUserButton();
