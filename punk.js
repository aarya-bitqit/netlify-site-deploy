let app = new Vue({
    el: '#app',
    data: {
        responseData: [],
        newData: [],
        baseURL: "https://api.punkapi.com/v2/beers?&per_page=24",
        search: "",
        abvValue: '',
        ibuValue: '',
        computedURL: '',
        val: this.search,
        pageNumber: 1,
        loading: false,
        counter: 1,
    },

    methods: {

        async getResult(url) {

            this.loading = false;
            let x = document.getElementById("noResultPage");

            try {
                let response = await fetch(url);
                app.responseData = await response.json();
                x.style.display = "none";
            } catch (error) {
                console.log('oops error occurred!',error);
            }


            if (app.responseData.length === 0) {
                x.style.display = "block";
            }


        },

        compareQuery() {
            if (this.val !== this.search) {
                this.abvValue = ''
                this.ibuValue = ''
                this.pageNumber = 1;

                topFunction();
            }

            this.computeURL()
        },

        computeURL() {

            topFunction();

            this.pageNumber = 1;

            if (this.search.length > 0) {

                let searchURL = `${this.baseURL}&beer_name=${this.search}${this.abvValue}${this.ibuValue}`
                this.getResult(searchURL);


            } else {
                let searchURL = `${this.baseURL}${this.abvValue}${this.ibuValue}`
                this.getResult(searchURL);
            }

        },

        clearFilter() {
            this.abvValue = ''
            this.ibuValue = ''
            this.pageNumber = 1;

            topFunction();
            this.computeURL();
        },


        async loadMore() {

            // if(this.responseData.length>0) {

                this.loading = true;


                let url;

                this.pageNumber += 1;

                if (this.search.length > 0) {
                    url = `${this.baseURL}&beer_name=${this.search}${this.abvValue}${this.ibuValue}&page=${this.pageNumber}`
                } else {
                    url = `${this.baseURL}${this.abvValue}${this.ibuValue}&page=${this.pageNumber}`
                }

                let response = await fetch(url);
                app.newData = await response.json();

                setTimeout(e => {

                    this.responseData = [...this.responseData, ...this.newData];
                }, 400);

                if (app.newData.length === 0) {
                    this.loading = false;
                }
            // }
        },

    },

    mounted() {
        this.getResult(this.baseURL);
    }
})


const intersectionObserver = new IntersectionObserver((entries) => {

    if (entries[0].intersectionRatio > 0) {

        app.loadMore();
    }

});

intersectionObserver.observe(document.querySelector("#loading"));

let debounce = function (fn, d) {
    let timer;
    return function () {
        let context = this,
            args = arguments;
        clearTimeout(timer);
        timer =  setTimeout(() => {
            app.compareQuery.apply(context, arguments);
        }, d);
    }
}

let debounceFunction = debounce(app.compareQuery, 200);

let topButton = document.getElementById("topBtn");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.addEventListener("scroll", function () {

    let header = document.getElementById("actionBar");
    header.classList.toggle("sticky", window.scrollY > 212);

})

document.getElementById("input").addEventListener("search", function (event) {
    app.computeURL()
});