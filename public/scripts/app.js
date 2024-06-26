const github_api_url = "https://api.github.com/users/flp2113";
const github_api_repos_url = "https://api.github.com/users/flp2113/repos";
const github_api_following_url = "https://api.github.com/users/flp2113/following";

const profile_section = document.querySelector("#profile");
const repositories_title = document.querySelector("#repositories-title");
const repositories_section = document.querySelector("#repositories");
const highlight_section = document.querySelector("#highlight");
const carousel_inner = document.querySelector(".carousel-inner");
const team_section = document.querySelector("#team");

//GET FUNCTIONS
const get_user = async () => {
    try {
        const response = await axios.get(github_api_url);
        return response.data;
    } catch (error) {
        profile_section.style.display = "block";
        profile_section.innerHTML = '<p class="error">Error fetching user information.</p>'
        console.log("Error fetching user information.", error);
    }
}

const get_repositories = async () => {
    try {
        const response = await axios.get(github_api_repos_url);
        return response.data;
    } catch (error) {
        repositories_title.innerText = "Repositories (0)";
        repositories_section.style.display = "block";
        repositories_section.innerHTML = '<p class="error">Error fetching user repositories.</p>';
        console.log("Error fetching user repositories.", error);
    }
}

const get_highlight = async () => {
    try {
        const response = await axios.get("https://newsapi.org/v2/everything?q=tech", {
            headers: { "Authorization": `7b367ba517fb4da5b067cb20c6ea6f08` }
        });
        return response.data;
    } catch (error) {
        highlight_section.innerHTML = '<p class="error">Error fetching highlight.</p>'
        console.log("Error fetching highlight.", error);
    }
}

const get_team = async (index = 0) => {
    try {
        const following_response = await axios.get(github_api_following_url);
        try {
            const following_inner_response = await axios.get(`https://api.github.com/users/${following_response.data[index].login}`);
            return [following_response.data, following_inner_response.data];
        } catch (error) {
            team_section.innerHTML = '<p class="error">Error inner fetching following users.</p>'
            console.log("Error inner fetching following users.", error);
        }
    } catch (error) {
        team_section.innerHTML = '<p class="error">Error fetching following users.</p>'
        console.log("Error fetching following users.", error);
    }
}

//CREATE FUNCTIONS
const create_profile = async () => {
    const data = await get_user();
    const user_profile = `       
            <img id="profile-picture" src="${data.avatar_url}" alt="user profile">
            <div id="profile-content">
                <p class="important" id="profile-name">
                    ${data.name}
                    <span id="profile-followers">
                        <svg class="followers-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                        </svg>
                        ${data.followers}
                    </span>
                </p>
                <p id="profile-bio">${data.bio}</p>
                <p id="profile-location-website"><strong>Location: </strong>${data.location}</p>
                <div id="profile-icons">
                    <a href="https://github.com/flp2113" target="_blank">
                        <svg class="socialmedia-icons" id="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/felipe.bao13/" target="_blank">
                        <svg class="socialmedia-icons" id="instagram-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                        </svg>
                    </a>
                    <a href="#">
                        <svg class="socialmedia-icons" id="linkedin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                        </svg>
                    </a>
                    <a href="#">
                        <svg class="socialmedia-icons" id="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                        </svg>
                    </a>
                </div>
        `
    profile_section.innerHTML = user_profile;
}

const create_repositories = async () => {
    const data = await get_repositories();
    repositories_title.innerText = `Repositories (${data.length})`;
    for(let i = 0; i < data.length; i++){
        let new_link = document.createElement("a");
        let new_card = document.createElement("div");
        new_card.classList.add("card");
        new_card.innerHTML = ` 
                    <img src="assets/img/algorithms.png" class="card-img-top" alt="repositoryimage">
                    <div class="card-body">
                        <div class="card-title-text">
                            <h5 class="card-title">${data[i].name}</h5>
                            <p class="card-text">${data[i].description}</p>
                        </div>
                        <div class="repository-info">
                            <span class="repository-stars">
                                <svg class="stars-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                </svg>
                                ${data[i].stargazers_count}
                            </span>
                            <span class="repository-watchers">
                                <svg class="followers-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                                </svg> 
                                ${data[i].watchers}
                            </span>
                        </div>
                    </div>
                `;
        new_link.append(new_card);
        new_link.href = `/public/repo.html?id=${data[i].id}`;
        new_link.style.textDecoration = 'none';
        new_card.style.height = '100%';
        repositories_section.append(new_link);
    }
}

const create_highlight = async () => {
    let counter = 0;
    const data = await get_highlight();
    for (let i = 0; i < data.totalResults; i++) {
        if (data.articles[i].urlToImage) {
            if (counter == 5) {
                break;
            }
            let new_carousel_item = document.createElement("div");
            new_carousel_item.classList.add("carousel-item");
            new_carousel_item.classList.add("active");
            new_carousel_item.innerHTML = `
                <img src="${data.articles[i].urlToImage}" class="d-block w-100" alt="news">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${data.articles[i].title}</h5>
                    <p>${data.articles[i].description}</p>
                </div>
            `
            carousel_inner.append(new_carousel_item);
            counter++;
        }
    }
}

const create_team = async () => {
    let vec_data2 = await get_team();
    for (let i = 0; i < vec_data2[0].length; i++) {
        let vec_data = await get_team(i);
        let team_name = vec_data[1].name;
        if (!team_name) {
            team_name = vec_data[0][i].login;
        }
        let new_cell = document.createElement("div");
        new_cell.classList.add("team-cell");
        new_cell.innerHTML = `
                <div class="team-cell">
                    <a class="team-link" href="${vec_data[1].html_url}" target="_blank">
                        <img class="team-picture" src="${vec_data[0][i].avatar_url}" alt="teammate">
                        <p class="team-name">${team_name}</p>
                    </a>
                </div>
                `
        team_section.append(new_cell);
    }
}

create_profile();
create_repositories();
create_highlight();
create_team();