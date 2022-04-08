'use strict';
/* ---------------------------------------*/
/* --- "Фильтр Тяговые кислотные АКБ" --- */
/* ---------------------------------------*/

// формирование url с параметрами фильтра
(function () {
    let applyFilterButton = document.querySelector('#filterStartButton');       // находим кнопку Применить (фильтр)  
    let filters = [                                                             // фильтры присутствующие на странице (id слоя обертки фильтра)
        {
            id: 'fvoltage',                                                     // id фильтра в html
            type: 'checkbox',                                                   // тип фильтра
            values: []                                                          // отмеченные значения
        },
        {
            id: 'fbrand',
            type: 'checkbox',
            values: []
        },
        {
            id: 'fcapacity',
            type: 'select',
            values: []
        }
    ]

    let urlPage = new URL(document.location.href);                              // url страницы

    // ! ------------------------------------------------------------------------------------------

    // если кнопка Применить найдена вешаем на нее обработчик события
    if (filterStartButton) { filterStartButton.addEventListener('click', clickApplyFilterButton); }

    // ! ------------------------------------------------------------------------------------------

    // при нажатии на пункт фильтра сразу срабатыает нажатие на кн Применить.
    function clickApplyFilterButtonEmulation() {
        filters.forEach(function (filter) {
            // получим тело фильтра
            let filterBody = document.querySelector(`#${filter.id}`);

            switch (filter.type) {
                case 'checkbox':
                    // получим label`ы полей фильтра
                    let filterOptionsLabel = Array.from(filterBody.querySelectorAll('label'));

                    // повесим на них обработчик события
                    filterOptionsLabel.forEach(function (label) {
                        label.addEventListener('click', function () {
                            // при клике запустим ф-ю, срабатывающую при нажатии на кн Применить
                            setTimeout(clickApplyFilterButton, 300);
                        });
                    });
                    break;

                case 'select':
                    // получим select
                    let select = filterBody.querySelector('select');
                    // повесим на него обработчик события
                    select.addEventListener('change', function () {
                        // при клике запустим ф-ю, срабатывающую при нажатии на кн Применить
                        setTimeout(clickApplyFilterButton, 300);
                    });
                    break;
            }
        });
    }

    // активируем для больших экранов
    if (window.innerWidth > 992) { clickApplyFilterButtonEmulation(); }

    // ! ------------------------------------------------------------------------------------------    

    // нажатие кн Применить (фильтр)
    function clickApplyFilterButton() {
        addParameterUrl('fa', 'akb');       // добавляем параметр активирующий фильтрацию
        getFilterElements();                // получим фильтры (выбранные значения) со страницы
        addFilterValuesUrl();               // добавим значения фильтров в параметры ссылки
        followLink();                       // перейдем по сформированной ссылке
    }

    // получим фильтры со страницы
    function getFilterElements() {
        filters.forEach(function (filter) {
            // получим тело фильтра
            let filterBody = document.querySelector(`#${filter.id}`);

            // в зависимости от типа полей фильтров
            switch (filter.type) {
                case 'checkbox':
                    // получим input поля фильтра
                    let filterOptions = Array.from(filterBody.querySelectorAll('input'));
                    // оставим только выбранные
                    let selectedOptions = filterOptions.filter(function (element) { return element.checked; });
                    // оставим только значения выбранных
                    filter.values = selectedOptions.map(function (element) { return element.value; });
                    break;

                case 'select':
                    // получим select
                    let select = filterBody.querySelector('select');
                    // получим его значение
                    let value = select.value;
                    // запишем значение, если оно отлично от базового
                    if (value !== 'all') { filter.values.push(value); }
                    break;
            }
        });
    }

    // добавим значения фильтров в параметры ссылки
    function addFilterValuesUrl() {
        // перебираем фильтры
        filters.forEach(function (filter) {
            let parameter = '';

            if (filter.values.length !== 0) {
                filter.values.forEach(function (value) { parameter += value + ' '; });      // перебираем и добавляем значения                
                parameter = parameter.slice(0, -1);                                         // удалить последний пробел
                addParameterUrl(filter.id, parameter);
            } else {
                deleteParameterUrl(filter.id);
            }
        });
    }

    // добавляем параметр в ссылку
    function addParameterUrl(key, value) { urlPage.searchParams.set(key, value); }

    // удаляем параметр из ссылки при его наличии
    function deleteParameterUrl(key) { if (urlPage.searchParams.has(key)) { urlPage.searchParams.delete(key); } }

    // перейдем по сформированной ссылке
    function followLink() { document.location.href = urlPage; }
})();


// формирование фильтров из параметров url
(function () {
    let urlPage = new URL(document.location.href);                              // url страницы
    let filters = [                                                             // фильтры присутствующие на странице (id слоя обертки фильтра)
        {
            id: 'fvoltage',
            body: '',
            type: 'checkbox',
            values: []
        },
        {
            id: 'fbrand',
            body: '',
            type: 'checkbox',
            values: []
        },
        {
            id: 'fcapacity',
            body: '',
            type: 'select',
            values: []
        }
    ]

    // ! ------------------------------------------------------------------------------------------

    // запустим проверку параметра адресной строки на необходимость выставления фильтров
    document.addEventListener("DOMContentLoaded", checkFilterActivator);

    // ! ------------------------------------------------------------------------------------------

    // проверка параметра адресной строки на необходимость выставления фильтров
    function checkFilterActivator() {
        if (urlPage.searchParams.has('fa')) {                       // если есть параметр активации
            let fa = urlPage.searchParams.get('fa');                // получить его значение
            if (fa === 'akb') { startInitializationFilters() }      // и он равен "akb" - запускаем дальнейшие процессы
        }
    }

    // инициализация фильтров и параметров адресной строки
    function startInitializationFilters() {
        getFilters();                               // получим фильтры
        getFilterValues();                          // получить значения фильтров
        markFilterValues();                        // отметить значения выбранных фильтров
    }

    // получим фильтры
    function getFilters() { filters.forEach(function (filter) { filter.body = document.querySelector(`#${filter.id}`); }); }

    // получить значения фильтров
    function getFilterValues() {
        filters.forEach(function (filter) {
            // получим все значения
            let key = filter.id;
            // разобъем на каждое значение
            if (urlPage.searchParams.has(key)) {
                let values = urlPage.searchParams.get(key);
                filter.values = values.split(' ');
            }
        });
    }

    // отметить значения выбранных фильтров
    function markFilterValues() {
        filters.forEach(function (filter) {
            // получим тело фильтра
            let filterBody = document.querySelector(`#${filter.id}`);

            // в зависимости от типа полей фильтров
            switch (filter.type) {
                case 'checkbox':
                    // получим input поля фильтра
                    let filterOptions = Array.from(filterBody.querySelectorAll('input'));

                    // переберем возможные значения (input`ы) данного фильтра
                    filterOptions.forEach(function (option) {

                        // переберем значения которые неоходимо отметить
                        filter.values.forEach(function (value) {
                            // и отметим необходимые
                            if (value === option.value) { option.checked = true; }
                        });

                    });
                    break;

                case 'select':
                    let select = filterBody.querySelector('select');
                    if (filter.values.length > 0) { select.value = filter.values[0]; }
                    break;
            }
        });
    }
})();


// кн сбросить (фильтры)
(function () {
    let clearFilterButton = document.querySelector('#filterClearButton');       // находим кнопку Сбросить (фильтр)  
    let filters = [                                                             // фильтры присутствующие на странице (id слоя обертки фильтра)
        {
            id: 'fvoltage'
        },
        {
            id: 'fbrand'
        },
        {
            id: 'fcapacity'
        }
    ]

    let urlPage = new URL(document.location.href);                              // url страницы    

    // ! ------------------------------------------------------------------------------------------

    // если кнопка Сбросить найдена вешаем на нее обработчик события
    if (clearFilterButton) { clearFilterButton.addEventListener('click', clickClearFilterButton); }

    // ! ------------------------------------------------------------------------------------------

    // нажатие кн Сбросить
    function clickClearFilterButton() {
        startFilterCleaning();          // удалим парметры связанные с фильтрацией
        followLink();                   // перейдем по очищенной ссылке
    }

    // удалим парметры связанные с фильтрацией
    function startFilterCleaning() {
        // удалим праметр активации фильтра
        if (urlPage.searchParams.has('fa')) { urlPage.searchParams.delete('fa'); }
        // удалим параметры фильтрации
        filters.forEach(function (filter) {
            let key = filter.id;
            if (urlPage.searchParams.has(key)) { urlPage.searchParams.delete(key); }
        });
    }

    // перейдем по очищенной ссылке
    function followLink() { document.location.href = urlPage; }
})();


// вывод сообения, если результаты фильтрации ни чего не нашли
(function () {
    let countResults = document.querySelector('#count-results');                               // кол-во отфильтрованных товаров
    let textZeroResult = document.querySelector('.basic-column__text-zero-result');            // элемент для вывода текста

    // ! ------------------------------------------------------------------------------------------


    if ((countResults) && (textZeroResult)) {
        countResults = Number(countResults.textContent);                        // получим значение
        if (countResults === 0) { outputMessage(); }                            // выведем сообщение что ничего не найдено
    }

    // ! ------------------------------------------------------------------------------------------

    // вывести сообщение что ничего не найдено
    function outputMessage() {
        textZeroResult.style.display = 'flex';
        textZeroResult.textContent = 'Ничего не найдено. Попробуйте другие варианты фильтрации.';
    }
})();

