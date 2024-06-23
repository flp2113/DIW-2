const url = new URL(location);
const params = new URLSearchParams(url.search);

const github_api_repos_url = "https://api.github.com/users/flp2113/repos";

const page_title = document.querySelector("title");
const repository_title = document.querySelector("#repository-title");
const repository_info_section = document.querySelector("#repository-info");

const get_repositories = async () => {
    try {
        const response = await axios.get(github_api_repos_url);
        return response.data;
    } catch (error) {
        repository_info_section.innerHTML = '<p class="error">Error fetching user repository.</p>'
        console.log("Error fetching user repository.", error);
    }
}

const display_info = async () => {
    const data = await get_repositories();
    let repository;
    for(let i = 0; i < data.length; i++){
        if(data[i].id == params.get('id')){
            repository = data[i];
            break;
        }
    }

    if(repository === undefined){
        page_title.innerText = `Felipe Maia | ERROR`
        repository_title.classList.add("error");
        repository_title.innerText = "ERROR FETCHING REPOSITORY";
    } else {
        page_title.innerText = `Felipe Maia | ${repository.name}`
        repository_title.innerHTML = `
            ${repository.name}
            <span class="repository-stars">
                <svg class="stars-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                </svg>
                ${repository.stargazers_count}
            </span>
                <span class="repository-watchers">
                <svg class="followers-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                </svg> 
                ${repository.watchers}
            </span>
            `;
        
        repository_info_section.innerHTML = `
            <p class="important info" id="repository-description">Description</p>
            <p>${repository.description}</p>

            <p class="important info" id="creation-date">Creation Date</p>
            <p>${repository.created_at}</p>

            <p class="important info" id="language">Language</p>
            <p>${repository.language}</p>

            <p class="important info" id="link">Link</p>
            <p><a href="${repository.html_url}">${repository.html_url}</a></p>

            <p class="important info" id="topics-title">Topics</p>
            <div id="topics"></div>
        `;

        const topics = document.querySelector("#topics");
        for(let i = 0; i < repository.topics.length; i++){
            let topic = document.createElement("span");
            topic.classList.add("topic");
            topic.innerText = `${repository.topics[i]}`;
            topics.append(topic);
        }
    }
}

display_info();