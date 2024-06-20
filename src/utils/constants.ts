export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    headers: {
        'Content-Type': 'application/json',
    },
    header: {
        basketButton: '.header__basket',
        basketCounter: '.header__basket-counter',
    },
    cardCatalog: {
        image: '.card__image',
        title: '.card__title',
        category: '.card__category',
        price: '.card__price',
    },
    cardPreview: {
        description: '.card__text',
        image: '.card__image',
        title: '.card__title',
        category: '.card__category',
        price: '.card__price',
        button: '.card__button',
    },
    cardCompact: {
        title: '.card__title',
        price: '.card__price',
        button: '.card__button',
    },
    modal: {
        closeButton: '.modal__close',
        content: '.modal__content',
    },
    basket: {
        actionButton: '.basket__button',
        catalog: '.basket__list',
        itemIndex: '.basket__item-index',
	    total: '.basket__price',
    },
    form: {
        fields: '.order',
        inputs: '.form__input',
        actionButton: '.modal__action_button',
        errors: '.form__errors',
    },
    orderSuccess: {
        description: '.order-success__description',
        button: '.order-success__close',
    },
    elements: {
        cardsContainer: '.gallery',
        modal: '#modal-container',
    }
};

export const cardCategories: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
}

export type TConstraints = Record<string, {
    presence?: {message: string, allowEmpty: boolean},
    length?: {
        minimum?: number,
        maximum?: number,
        tooShort?: string,
        tooLong?: string,
    },
    format?: string
}>

export const constraintsOrder = {
    'payment': {
        presence: { message: 'Выберите метод оплаты', allowEmpty: false },
    },
    'address': {
        presence: { message: 'Это поле не может быть пустым', allowEmpty: false },
    }
}

export const constraintsContacts = {
    'email': {
        presence: { message: 'Это поле не может быть пустым', allowEmpty: false },
    },
    'phone': {
        presence: { message: 'Это поле не может быть пустым', allowEmpty: false },
    }
}