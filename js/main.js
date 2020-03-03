'use strict';

var PHOTO_NUMBER = 25;
var AVATAR_NUMBER = 6;
var MAX_COMMENTS = 100;
var VISIBLE_COMMENTS = 5;
var ESC_KEYCODE = 27;
var SCALE_STEP = 25;
var MIN_SCALE = 25;
var MAX_SCALE = 100;
var MAX_BLUR_VALUE = 3;
var BRIGHTNESS_RANGE = 2;
var MIN_BRIGHTNESS_VALUE = 1;
var MAX_HASHTAGS = 5;
var MAX_HASHTAG_LENGTH = 20;

var pictureBlock = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var bigPictureElement = document.querySelector('.big-picture');
var commentsList = document.querySelector('.social__comments');
var commentElement = commentsList.querySelector('.social__comment');

var uploadFile = pictureBlock.querySelector('#upload-file');
var uploadFileForm = pictureBlock.querySelector('.img-upload__overlay');
var editCloseButton = uploadFileForm.querySelector('#upload-cancel');
var imagePreview = uploadFileForm.querySelector('.img-upload__preview img');

var smallerScaleButton = uploadFileForm.querySelector('.scale__control--smaller');
var biggerScaleButton = uploadFileForm.querySelector('.scale__control--bigger');
var scaleField = uploadFileForm.querySelector('.scale__control--value');

var effectButtons = uploadFileForm.querySelectorAll('.effects__radio');
var effectLevel = uploadFileForm.querySelector('.effect-level');
var effectInput = effectLevel.querySelector('.effect-level__value');
var effectlevelBar = effectLevel.querySelector('.effect-level__line');
var effectLevelButton = effectLevel.querySelector('.effect-level__pin');
var currentEffect;

var hashtagInput = uploadFileForm.querySelector('.text__hashtags');
var commentTextArea = uploadFileForm.querySelector('.text__description');

var commentExamples = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var names = ['Антон', 'Светлана', 'Аким', 'Лука', 'Макс', 'Валентина'];

var getRandomElement = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var generateComments = function (commentsNumber) {
  var comments = [];

  for (var i = 0; i < commentsNumber; i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomElement(1, AVATAR_NUMBER) + '.svg',
      message: commentExamples[getRandomElement(0, commentExamples.length)],
      name: names[getRandomElement(0, names.length)]
    });
  }

  return comments;
};

var generatePhotoDescription = function () {
  var photos = [];
  for (var i = 0; i < PHOTO_NUMBER; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomElement(15, 200),
      comments: generateComments(getRandomElement(0, MAX_COMMENTS))
    });
  }

  return photos;
};

var showBigPicture = function (photo) {

  bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
  bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photo.description;

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < VISIBLE_COMMENTS; i++) {
    var comment = commentElement.cloneNode(true);

    comment.querySelector('.social__picture').src = photo.comments[i].avatar;
    comment.querySelector('.social__picture').alt = photo.comments[i].name;
    comment.querySelector('.social__text').textContent = photo.comments[i].message;

    fragment.appendChild(comment);
  }

  var children = commentsList.children;

  for (i = children.length - 1; i >= 0; i--) {
    commentsList.removeChild(children[i]);
  }

  commentsList.appendChild(fragment);

  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.comments-loader').classList.add('visually-hidden');
};

var renderPhoto = function () {

  var photos = generatePhotoDescription();

  var fragment = document.createDocumentFragment();


  for (var i = 0; i < photos.length; i++) {
    var picture = pictureTemplate.cloneNode(true);

    picture.querySelector('.picture__img').src = photos[i].url;
    picture.querySelector('.picture__likes').textContent = photos[i].likes;
    picture.querySelector('.picture__comments').textContent = photos[i].comments.length;

    fragment.appendChild(picture);
  }

  showBigPicture(photos[0]);

  pictureBlock.appendChild(fragment);
};

var closeEditForm = function () {
  uploadFileForm.classList.add('hidden');
  document.removeEventListener('keydown', onEscCloseForm);
  uploadFile.value = '';
};

var onEscCloseForm = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEditForm();
  }

var openEditForm = function () {
  uploadFileForm.classList.remove('hidden');
  document.addEventListener('keydown', onEscCloseForm);
};

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

var onChangeSelectFilter = function () {
  imagePreview.style.filter = '';

  for (i = 0; i < effectButtons.length; i++) {
    if (effectButtons[i].checked) {
      imagePreview.classList.remove('effects__preview--' + currentEffect);
      currentEffect = effectButtons[i].value;
      if (currentEffect !== 'none') {
        effectLevel.classList.remove('hidden');
        imagePreview.classList.add('effects__preview--' + currentEffect);
      } else {
        effectLevel.classList.add('hidden');
      }
    }
  }
};

var countEffectLevel = function () {
  var bar = effectlevelBar.getBoundingClientRect();
  var pin = effectLevelButton.getBoundingClientRect();
  var barLength = bar.right - bar.left;
  var pinOffset = pin.left - bar.left;

  return Math.round((pinOffset / barLength + 0.02) * 100);
};

var setEffectLevel = function () {
  effectInput.value = countEffectLevel();

  var effect = window.getComputedStyle(imagePreview).filter.split('(', 1);

  switch (effect[0]) {
    case 'grayscale':
      effect += '(' + effectInput.value + '%)';
      imagePreview.style.filter = effect;
      break;
    case 'sepia':
      effect += '(' + effectInput.value + '%)';
      imagePreview.style.filter = effect;
      break;
    case 'invert':
      effect += '(' + effectInput.value + '%)';
      imagePreview.style.filter = effect;
      break;
    case 'blur':
      effect += '(' + (effectInput.value / 100 * MAX_BLUR_VALUE) + 'px)';
      imagePreview.style.filter = effect;
      break;
    case 'brightness':
      effect += '(' + (effectInput.value / 100 * BRIGHTNESS_RANGE + MIN_BRIGHTNESS_VALUE) + ')';
      imagePreview.style.filter = effect;
      break;
  }
};

var searchForDuplicate = function (hashtags) {
  var duplicateFlag = false;

  for (var i = 0; i < hashtags.length; i++) {
    for (var j = i + 1; j < hashtags.length; j++) {
      if (hashtags[i].indexOf(hashtags[j]) > -1) {
        duplicateFlag = true;
        return duplicateFlag;
      }
    }
  }

  return duplicateFlag;
};

var validateHashtags = function () {
  var hashtags = hashtagInput.value.toLowerCase().split(' ');

  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== '#') {
      hashtagInput.setCustomValidity('Хэш-тег должен начинатсья с символа #');
    } else if (hashtags[i].length === 1) {
      hashtagInput.setCustomValidity('Хэш-тег не может состоять из одного символа #');
    } else if (hashtags[i].indexOf('#', 1) > -1) {
      hashtagInput.setCustomValidity('Хэш-теги должны быть разделены пробелом');
    } else if (searchForDuplicate(hashtags)) {
      hashtagInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
    } else if (hashtags.length > MAX_HASHTAGS) {
      hashtagInput.setCustomValidity('Максимальное число тегов: ' + MAX_HASHTAGS);
    } else if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
      hashtagInput.setCustomValidity('Максимальная длина хэш-тэга: ' + MAX_HASHTAG_LENGTH + ' символов');
    } else {
      hashtagInput.setCustomValidity('');
    }
  }
};

uploadFile.addEventListener('change', function () {
  openEditForm();
});

editCloseButton.addEventListener('click', function () {
  closeEditForm();
});

smallerScaleButton.addEventListener('click', function () {
  var positiveFlag = false;
  setImageScale(positiveFlag);
});

biggerScaleButton.addEventListener('click', function () {
  var positiveFlag = true;
  setImageScale(positiveFlag);
});

for (var i = 0; i < effectButtons.length; i++) {
  effectButtons[i].addEventListener('change', onChangeSelectFilter);
}

effectLevelButton.addEventListener('mouseup', function () {
  setEffectLevel();
});

hashtagInput.addEventListener('change', function () {
  validateHashtags();
});

hashtagInput.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscCloseForm);
});

hashtagInput.addEventListener('blur', function () {
  document.addEventListener('keydown', onEscCloseForm);
});

commentTextArea.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscCloseForm);
});

commentTextArea.addEventListener('blur', function () {
  document.addEventListener('keydown', onEscCloseForm);
});

renderPhoto();
