'use strict';

(function () {

  var SCALE_STEP = 25;
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var MAX_BLUR_VALUE = 3;
  var BRIGHTNESS_RANGE = 2;
  var MIN_BRIGHTNESS_VALUE = 1;

  /* Инициализация блока предпросмотра изображения */
  var imagePreview = window.form.preview;

  /* Инициализация элементов масштабирования изображения */
  var smallerScaleButton = window.form.editFile
    .querySelector('.scale__control--smaller');
  var biggerScaleButton = window.form.editFile
    .querySelector('.scale__control--bigger');
  var scaleField = window.form.editFile
    .querySelector('.scale__control--value');

  /* Инициализация элементов работы с фильтрами */
  var effectButtons = window.form.editFile
    .querySelectorAll('.effects__radio');
  var effectlevelBar = window.form.effectLevel
    .querySelector('.effect-level__line');
  var effectLevelButton = window.form.effectLevel
    .querySelector('.effect-level__pin');
  var effectlevelFillBar = window.form.effectLevel
    .querySelector('.effect-level__depth');
  var currentEffect;
  var bar;
  var barLength;

  /**
   * Функция масштабирования изображения
   * @param {boolean} positiveFlag - флаг нажатия кнопок уменьшения/увеличения
   */
  var setImageScale = function (positiveFlag) {
    var currentScale = Number.parseInt(scaleField.value, 10);

    if (positiveFlag && (currentScale + SCALE_STEP) <= MAX_SCALE) {
      scaleField.value = (currentScale + SCALE_STEP) + '%';
      imagePreview.style.transform = 'scale(' + (currentScale + SCALE_STEP) / 100 + ')';
    }

    if (!positiveFlag && (currentScale - SCALE_STEP) >= MIN_SCALE) {
      scaleField.value = (currentScale - SCALE_STEP) + '%';
      imagePreview.style.transform = 'scale(' + (currentScale - SCALE_STEP) / 100 + ')';
    }
  };

  /**
   * Функция выбора фильтра
   */
  var onEffectButtonClick = function () {
    imagePreview.style.filter = '';

    effectButtons.forEach(function (item) {
      if (item.checked) {
        imagePreview.classList.remove('effects__preview--' + currentEffect);
        currentEffect = item.value;
        if (currentEffect !== 'none') {
          window.form.effectLevel.classList.remove('hidden');
          bar = effectlevelBar.getBoundingClientRect();
          barLength = bar.right - bar.left;
          imagePreview.classList.add('effects__preview--' + currentEffect);
          effectLevelButton.style.left = barLength + 'px';
          effectlevelFillBar.style.width = '100%';
          window.form.effectInput.setAttribute('value', MAX_SCALE);
        } else {
          window.form.effectLevel.classList.add('hidden');
          window.form.effectInput.setAttribute('value', 0);
        }
      }
    });
  };

  /**
   * Функция подсчета интенсивности эффекта
   * @return {number} процент, на который передвинут ползунок
   * интенсивности эффекта
   */
  var countEffectLevel = function () {
    var pin = effectLevelButton.getBoundingClientRect();
    var pinOffset = pin.left - bar.left;

    return Math.round((pinOffset / barLength + 0.02) * 100);
  };

  /**
   * Функция установки интенсивности эффекта на изображении
   */
  var setEffectLevel = function () {
    window.form.effectInput.setAttribute('value', countEffectLevel());

    var effect = window.getComputedStyle(imagePreview).filter.split('(', 1);

    switch (effect[0]) {
      case 'grayscale':
        effect += '(' + window.form.effectInput.value + '%)';
        imagePreview.style.filter = effect;
        break;
      case 'sepia':
        effect += '(' + window.form.effectInput.value + '%)';
        imagePreview.style.filter = effect;
        break;
      case 'invert':
        effect += '(' + window.form.effectInput.value + '%)';
        imagePreview.style.filter = effect;
        break;
      case 'blur':
        effect += '(' + (window.form.effectInput.value / 100 * MAX_BLUR_VALUE) + 'px)';
        imagePreview.style.filter = effect;
        break;
      case 'brightness':
        effect += '(' + (window.form.effectInput.value / 100 * BRIGHTNESS_RANGE + MIN_BRIGHTNESS_VALUE) + ')';
        imagePreview.style.filter = effect;
        break;
    }
  };

  /**
   * Функция обработчика нажатия на ползунок изменения интенсивности эффекта
   * @param {object} evt - объект Event
   */
  var onEffectPinMouseDown = function (evt) {
    evt.preventDefault();

    document.addEventListener('mousemove', onEffectPinMouseMove);
    document.addEventListener('mouseup', onEffectPinMouseUp);
  };

  /**
   * Функция обработчика перемещения мыши при нажатии на ползунок
   * изменения интенсивности эффекта
   * @param {object} evt - объект Event
   */
  var onEffectPinMouseMove = function (evt) {
    bar = effectlevelBar.getBoundingClientRect();
    barLength = bar.right - bar.left;

    var shift = evt.clientX - bar.left;

    if (shift > 0 && shift <= barLength) {
      effectLevelButton.style.left = shift + 'px';
    }

    effectlevelFillBar.style.width = countEffectLevel() + '%';

    setEffectLevel();
  };

  /**
   * Функция обработчика отпускания кнопки мыши после нажатия на
   * ползунок изменения интенсивности эффекта
   * @param {object} evt - объект Event
   */
  var onEffectPinMouseUp = function (evt) {
    evt.preventDefault();

    document.removeEventListener('mousemove', onEffectPinMouseMove);
    document.removeEventListener('mouseup', onEffectPinMouseUp);
  };

  /* Обработчики кнопок масштабирования изображения */
  smallerScaleButton.addEventListener('click', function () {
    var positiveFlag = false;
    setImageScale(positiveFlag);
  });

  biggerScaleButton.addEventListener('click', function () {
    var positiveFlag = true;
    setImageScale(positiveFlag);
  });

  /* Обработчики смены фильтра изображения */
  effectButtons.forEach(function (item) {
    item.addEventListener('change', onEffectButtonClick);
  });

  /* Обработчик нажатия на ползунок изменения интенсивности эффекта */
  effectLevelButton.addEventListener('mousedown', onEffectPinMouseDown);
})();
