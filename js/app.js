$(document).ready(()=>{
    $("#loader").fadeOut("slow")
})

// 
let allArticles = [];
let currentCategory = 'all';
let searchQuery = '';

$.getJSON('./json/headlines.json', function(articles) {
    allArticles = articles;
    processAndRender();
});

// Core processing function that filters by category and search query
function processAndRender() {
    let processed = allArticles.filter(article => {
        // 1. Category check
        const matchesCategory = (currentCategory === 'all') || (article.category === currentCategory);
        
        // 2. Search query check (searches title, excerpt, and full content if available)
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
            article.title.toLowerCase().includes(query) || 
            article.excerpt.toLowerCase().includes(query) || 
            (article.content && article.content.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
    });

    $("#loader").fadeIn("fast", renderFeed(processed)).fadeOut("slow")
    // renderFeed(processed);
}

// Keep track of the current pagination state outside the function
let currentFeedPage = 0;
const articlesPerPage = 6;

function renderFeed(articlesToRender, resetPage = true) {
    if (resetPage) {
        currentFeedPage = 0;
    }

    if (articlesToRender.length === 0) {
        $('#featured-article').html('');
        $('#article-feed').html('<p class="error-message">No articles found matching your search criteria.</p>');
        return;
    }

    // The first item of the filtered set becomes the featured article
    const featured = articlesToRender[0];
    const remaining = articlesToRender.slice(1);

    // Calculate pagination bounds
    const totalPages = Math.ceil(remaining.length / articlesPerPage);
    if (currentFeedPage >= totalPages && totalPages > 0) {
        currentFeedPage = totalPages - 1;
    }
    if (currentFeedPage < 0) {
        currentFeedPage = 0;
    }

    const startIndex = currentFeedPage * articlesPerPage;
    const paginatedRemaining = remaining.slice(startIndex, startIndex + articlesPerPage);

    $('#featured-article').html(`
        <article class="featured-card">
            <img src="./gallery/cover/${featured.thumbnail}" loading="lazy" alt="${featured.title}" class="featured-img">
            <div class="featured-content">
                <span class="category">${featured.category}</span>
                <h2 class="featured-title"><a href="article.html?id=${featured.id}">${featured.title}</a></h2>
                <p class="article-excerpt">${featured.excerpt}</p>
                <div class="article-footer">
                    <span>${featured.date}</span>
                    <a href="./article.html?id=${featured.id}" class="read-more">Read Analysis &rarr;</a>
                </div>
            </div>
        </article>
    `);

    // Render the current slice of remaining articles
    let feedHtml = '';
    $.each(paginatedRemaining, function(index, article) {
        feedHtml += `
            <article class="article-card">
                <img src="./gallery/cover/${article.thumbnail}" loading="lazy" alt="${article.title}" class="article-img">
                <div class="article-content">
                    <span class="category">${article.category}</span>
                    <h3 class="article-title"><a href="article.html?id=${article.id}">${article.title}</a></h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-footer">
                        <span>${article.date}</span>
                        <a href="./article.html?id=${article.id}" class="read-more">Read &rarr;</a>
                    </div>
                </div>
            </article>
        `;
    });

    // Append Next/Previous pagination controls if there are remaining articles
    if (remaining.length > articlesPerPage) {
        feedHtml += `
            <div class="pagination-controls" style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding: 10px 0;">
                <button id="prev-page" class="pagination-btn" ${currentFeedPage === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>&larr; Prev</button>
                <span class="page-indicator">Page ${currentFeedPage + 1} of ${totalPages}</span>
                <button id="next-page" class="pagination-btn" ${currentFeedPage >= totalPages - 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Next &rarr;</button>
            </div>
        `;
    }

    $('#article-feed').html(feedHtml);

    // Bind event handlers for the pagination buttons
    $('#prev-page').off('click').on('click', function() {
        if (currentFeedPage > 0) {
            currentFeedPage--;
            $("#loader").fadeIn("fast", hideLeadArticle).fadeOut("slow")
            // hideLeadArticle();
        }
    });

    $('#next-page').off('click').on('click', function() {
        if (currentFeedPage < totalPages - 1) {
            currentFeedPage++;
            $("#loader").fadeIn("fast", hideLeadArticle).fadeOut("slow")
            // hideLeadArticle();
            
        }
    });

    function hideLeadArticle() {
        
        renderFeed(articlesToRender, false);
        $('html, body').animate({ scrollTop: $('#article-feed').offset().top - 500 }, 'fast');

        if (currentFeedPage === 0) {
            $('#featured-article').fadeIn()
            return
        }

        $('#featured-article').fadeOut()
    }
}

// Event Listener for Category Buttons
$(document).on('click', '.filter-btn', function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    currentCategory = $(this).data('filter');
    $("#loader").fadeIn("fast", processAndRender).fadeOut("slow")
    // processAndRender();
});

// Event Listener for Live Search Input (triggers on every keystroke)
$(document).on('input', '#article-search', function() {
    searchQuery = $(this).val();
    // $("#loader").fadeIn("fast", processAndRender).fadeOut("slow")
    processAndRender();
});

// 
let footDate = new Date()

$("footer").html(`
    <ul>
        <li>
            <a href=""> <img src="./icons/youtube.svg" alt="8484"> </a>
            <a href=""> <img src="./icons/facebook.svg" alt="8484"> </a>
            <a href=""> <img src="./icons/email.svg" alt="8484"> </a>
        </li>
        <li>&copy;${footDate.getFullYear()}</li>
    </ul>    
`)