// 
$(document).ready(()=>{
    $("#loader").fadeOut("slow", ()=>{
        setTimeout(() => {
            getSuggestPage()
        }, 1000);
    })
})

// 
const params = new URLSearchParams(document.location.search);
const pageArticle = params.get("id")

// 
$.get(`./articles/${pageArticle}.html`, (res)=>{
    if (res) {
        $("#single-article").html(res)
    }
})

// 
function getSuggestPage() {
    $.get('./json/headlines.json', (res) => {
        // 1. Filter out the current active article
        const validArticles = res.filter(article => article.id != pageArticle);

        // 2. Randomize the filtered array using a Fisher-Yates shuffle / random sort
        const shuffled = validArticles.sort(() => 0.5 - Math.random());

        // 3. Take only the first 2 items from the randomized list
        const randomSuggestions = shuffled.slice(0, 2);

        let suggestPage = "";

        // 4. Loop through the 2 random articles to build the HTML
        $.each(randomSuggestions, (index, article) => {
            let headLine = article.title
            suggestPage += `
                <a href="./article.html?id=${article.id}">
                    <h5>${headLine.slice(0, 25)} ...</h5>
                    <img src="./gallery/cover/${article.thumbnail}" alt="${article.date}">
                </a>
            `;
        });

        // 5. Inject into the DOM once after the loop finishes
        // Recommended For You
        $("#article_suggestion").html(`
            <hr>
            <h4>You might also like:</h4> 
            <div id="suggestion_list"> ${suggestPage} </div>   
        `);
    });
}