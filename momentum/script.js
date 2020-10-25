"use strict";
class Momentum {
    constructor() {
        this.render = async () => {
            var _a, _b;
            (_a = this.main) === null || _a === void 0 ? void 0 : _a.classList.add('wrapper');
            (_b = this.body) === null || _b === void 0 ? void 0 : _b.appendChild(this.main);
            this.main.appendChild(this.createWeather(this.weather));
            this.main.appendChild(this.createBlockTime(this.time));
            this.main.appendChild(this.createGreetingAndFocus('greeting', this.getTimeOfDay(), 'name'));
            this.main.appendChild(this.createGreetingAndFocus('question', 'What Is Your Focus For Today?', 'focus'));
            this.main.appendChild(this.createQuote(this.quote));
            this.main.appendChild(this.createButtonChangeImages());
        };
        this.createGreetingAndFocus = (nameBlock, contentBlock, name) => {
            const blockGreeting = document.createElement('div');
            blockGreeting.classList.add(nameBlock);
            blockGreeting.innerText = contentBlock;
            const blockName = document.createElement('span');
            blockName.classList.add(name);
            blockName.contentEditable = 'true';
            blockName.innerText = localStorage.getItem(name) !== null ? localStorage.getItem(name) : `Enter ${name}`;
            blockGreeting.appendChild(blockName);
            blockName.addEventListener('blur', (e) => this.setNameOrFocus(e, blockName, name));
            blockName.addEventListener('keypress', (e) => this.setNameOrFocus(e, blockName, name));
            blockName.addEventListener('click', (e) => this.setNameOrFocus(e, blockName, name));
            return blockGreeting;
        };
        this.createQuote = (data) => {
            const blockQuote = document.createElement('blockquote');
            blockQuote.classList.add('container-quote');
            const quote = document.createElement('p');
            quote.classList.add('quote');
            quote.innerHTML = `&#8220;${data.quote.body}&#8222;`;
            const author = document.createElement('cite');
            author.classList.add('author');
            author.innerHTML = `${data.quote.author}`;
            blockQuote.append(quote, author);
            return blockQuote;
        };
        this.createWeather = (data) => {
            const blockWether = document.createElement('div');
            blockWether.classList.add('weather');
            const weatherCity = document.createElement('div');
            weatherCity.classList.add('weather__city');
            weatherCity.contentEditable = 'true';
            weatherCity.innerText = `${data.name}`;
            const weatherIcon = document.createElement('img');
            weatherIcon.classList.add('weather__icon');
            weatherIcon.src = `./assets/images/weather/${data.weather[0].icon}.svg`;
            weatherIcon.alt = `${data.weather[0].icon}`;
            const weatherTemp = document.createElement('div');
            weatherTemp.classList.add('weather__temp');
            weatherTemp.innerText = `${Math.round(data.main.temp)}°`;
            const weatherHumidity = document.createElement('div');
            weatherHumidity.classList.add('weather__humidity');
            weatherHumidity.innerHTML = `Humidity: ${data.main.humidity}%<br>Speed wind: ${data.wind.speed} m/c`;
            blockWether.append(weatherCity, weatherIcon, weatherTemp, weatherHumidity);
            weatherCity.addEventListener('blur', (e) => this.setNameOrFocus(e, weatherCity, 'city'));
            weatherCity.addEventListener('keypress', (e) => this.setNameOrFocus(e, weatherCity, 'city'));
            weatherCity.addEventListener('click', (e) => this.setNameOrFocus(e, weatherCity, 'city'));
            return blockWether;
        };
        this.backgroundImage = (value) => {
            let path;
            switch (true) {
                case (value < 6 || value === 24):
                    path = 'night';
                    break;
                case (value < 12):
                    path = 'morning';
                    break;
                case (value < 18):
                    path = 'day';
                    break;
                case (value < 24):
                    path = 'evening';
                    break;
            }
            const src = `./assets/images/${path}/${this.array[value - 1]}.jpg`;
            const img = document.createElement('img');
            img.src = src;
            img.onload = () => {
                this.body.style.backgroundImage = `url(${src})`;
            };
        };
        this.getQuote = async () => {
            const url = `https://favqs.com/api/qotd`;
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            return data;
        };
        this.getWeather = async (city) => {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=2065fc103d83010d4dbc57f1a1378f5a`;
                const res = await fetch(url);
                const data = await res.json();
                console.log(data);
                return data;
            }
            catch (e) {
                console.error(e);
            }
        };
        this.getGeolocation = async () => {
            const url = `https://ipinfo.io/json?token=4a00deb0d6261c`;
            const res = await fetch(url);
            const data = await res.json();
            return data.city;
        };
        this.createButtonChangeImages = () => {
            const blockButton = document.createElement('div');
            blockButton.classList.add('container-button');
            const buttonImage = document.createElement('button');
            buttonImage.classList.add('change-image');
            const buttonQuote = document.createElement('button');
            buttonQuote.classList.add('change-quote');
            blockButton.append(buttonImage, buttonQuote);
            let index = this.hour;
            buttonQuote.addEventListener('click', async () => {
                const result = await this.getQuote();
                document.querySelector('.quote').innerHTML = `&#8220;${result.quote.body}&#8222;`;
                document.querySelector('.author').innerHTML = result.quote.author;
            });
            buttonImage.addEventListener('click', () => {
                index++;
                if (index === 25) {
                    index = 1;
                }
                this.backgroundImage(index);
            });
            return blockButton;
        };
        this.createBlockTime = (value) => {
            const blockTime = document.createElement('time');
            blockTime.className = 'time';
            blockTime.innerHTML = value;
            return blockTime;
        };
        this.getTime = () => {
            var _a;
            const time = new Date();
            if (time.getHours() !== this.hour) {
                this.backgroundImage(time.getHours());
            }
            this.hour = time.getHours();
            const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
            const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
            this.time = `<span>${this.days[time.getUTCDay()]} ${time.getUTCDate()} ${this.months[time.getMonth()]}  </span> <span>${this.hour} : ${minutes} : ${seconds}</span>`;
            (_a = document.querySelector('time')) === null || _a === void 0 ? void 0 : _a.innerHTML = this.time;
            setTimeout(() => { this.getTime(); }, 1000);
        };
        this.getTimeOfDay = () => {
            this.hour = new Date().getHours();
            switch (true) {
                case (this.hour < 6 || this.hour === 24):
                    this.timeOfDay = 'Good night,';
                    break;
                case (this.hour < 12):
                    this.timeOfDay = 'Good morning,';
                    break;
                case (this.hour < 18):
                    this.timeOfDay = 'Good afternoon,';
                    break;
                case (this.hour < 24):
                    this.timeOfDay = 'Good evening,';
                    break;
            }
            return this.timeOfDay;
        };
        this.setNameOrFocus = async (event, block, name) => {
            if (event.type === 'click' && this.focused) {
                localStorage.setItem(name, event.target.innerText);
                block.innerHTML = '';
                block.focus();
                this.focused = false;
            }
            if (event.type === 'keypress' && event.keyCode === 13) {
                event.target.textContent.length === 0 || !event.target.textContent.trim() ? event.target.textContent = localStorage.getItem(name) : event.target.textContent;
                block.blur();
            }
            if (event.type === 'blur') {
                event.target.textContent.length === 0 || !event.target.textContent.trim() ? event.target.textContent = localStorage.getItem(name) : event.target.textContent;
                if (name === 'city') {
                    this.updateWeather(event.target.innerText, block);
                }
                else {
                    localStorage.setItem(name, event.target.innerText);
                }
                this.focused = true;
            }
        };
        this.updateWeather = async (city, block) => {
            this.weather = await this.getWeather(city);
            if (this.weather.cod === '404') {
                block.innerText = localStorage.getItem('city');
                this.showError(this.weather.message);
            }
            else {
                this.main.removeChild(document.querySelector('.weather'));
                this.main.appendChild(this.createWeather(this.weather));
                localStorage.setItem('city', city);
            }
        };
        this.showError = (errorMessage) => {
            const errors = document.createElement('div');
            errors.id = 'error';
            errors.className = 'error';
            errors.innerHTML = `<p class="error-massage">${errorMessage}</p>`;
            this.main.append(errors);
            setTimeout(() => {
                var _a;
                (_a = this.main) === null || _a === void 0 ? void 0 : _a.lastElementChild.remove();
            }, 4000);
        };
        this.init = async () => {
            this.getTime();
            this.backgroundImage(this.hour);
            this.city = localStorage.getItem('city') !== null ? localStorage.getItem('city') : await this.getGeolocation();
            this.quote = await this.getQuote();
            this.weather = await this.getWeather(this.city);
            console.log(this.city, this.weather);
            this.render();
        };
        this.body = document.querySelector('body');
        this.main = document.createElement('div');
        this.hour;
        this.time;
        this.timeOfDay;
        this.city;
        this.weather;
        this.quote;
        this.focused = true;
        this.array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].sort(() => Math.random() - 0.5);
        this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
    }
}
const momentum = new Momentum();
momentum.init();
