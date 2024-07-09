import React from 'react'
const TEST_CONTACTS = {
    data: {
      id: 1,
      attributes: {
        address: "Республика Карелия, г. Сортавала, ул. Ленина, д. 1",
        title: "Как добраться?",
        summary:
          "На поезде «Ласточка» из города Санкт-Петербург\nНа туристическом поезде из города Москва\nНа автобусе из города Санкт-Петербург\nНа автомобиле",
        createdAt: "2024-06-08T20:40:21.877Z",
        updatedAt: "2024-06-08T20:49:58.115Z",
        publishedAt: "2024-06-08T20:45:45.019Z",
        content: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "До города Сортавала можно добраться:",
                bold: true,
              },
            ],
          },
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "На поезде «Ласточка» из города Санкт-Петербург",
                  },
                ],
              },
            ],
          },
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [
                  {
                    type: "text",
                    text: "На туристическом поезде из города Москва",
                  },
                ],
              },
            ],
          },
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [
                  { type: "text", text: "На автобусе из города Санкт-Петербург" },
                ],
              },
            ],
          },
          {
            type: "list",
            format: "unordered",
            children: [
              {
                type: "list-item",
                children: [{ type: "text", text: "На автомобиле" }],
              },
            ],
          },
        ],
      },
    },
    meta: {},
  };
function ContactSection() {
  return (
    <footer
  className="w-dvw bg-zinc-50 text-center text-surface dark:bg-neutral-700 dark:text-white">
  <div className="px-6 pt-6">
    <form>
      <div
        className="gird-cols-1 grid items-center justify-center gap-4 md:grid-cols-3">
        <div className="md:mb-6 md:ms-auto">
          <p>
            <strong>Хочу подписаться на новости</strong>
          </p>
        </div>

        <div className="relative md:mb-6 border-b" data-twe-input-wrapper-init>
          <input
            type="email"
            className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInputEmail2"
            placeholder="Email address" />
          <label
            htmlFor="exampleFormControlInputEmail2"
            className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary"
            >Почта
          </label>
        </div>

        <div className="mb-6 md:me-auto">
          <button
            type="button"
            className="text-black inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal  shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong border "
            data-twe-ripple-init
            data-twe-ripple-color="light">
            Отправить
          </button>
        </div>
      </div>
    </form>
  </div>

  <div className="bg-black/5 p-4 text-center">
    © 2022-2024 Магия Севера: 
    <a href="https://tw-elements.com/"> Политика конфиденциальности</a>
  </div>
</footer>
  )
}

export default ContactSection