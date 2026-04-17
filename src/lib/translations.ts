export const translations = {
  ru: {
    nav: {
      assistant: "Ассистент",
      sales: "Продажи",
      debts: "Долги",
      clients: "Клиенты",
      analytics: "Аналитика",
      memories: "Запоминания",
      settings: "Настройки",
      logout: "Выйти"
    },
    dashboard: {
      welcome: "Добро пожаловать в SavdoBot",
      subtitle: "Твой бизнес под полным контролем ассистента.",
      aiStatus: "AI Мониторинг активен",
      stats: {
        totalSales: "Всего Продаж",
        expenses: "Расходы",
        profit: "Чистая Прибыль",
        clientDebts: "Долги Клиентов"
      }
    },
    chat: {
      welcome: "Привет! Я твой бизнес-ассистент SavdoBot. Чем я могу помочь? Можешь сказать: 'Добавь продажу на 50 000' или 'Сколько я заработал сегодня?'",
      placeholder: "Запишите продажу или спросите о прибыли...",
      thinking: "SavdoBot думает...",
      error: "Извините, произошла ошибка. Попробуйте еще раз позже.",
      saleRecorded: "Записал продажу на {amount} сум. 👍",
      expenseRecorded: "Записал расход: {desc} на {amount} сум.",
      debtAdded: "Добавил долг для {name}: {amount} сум. Теперь это в долговой книге.",
      reminderAdded: "Запомнил. Напомню: '{text}' в {time}. Предупрежу за 5 минут.",
      queryResult: "Твои общие продажи составляют {amount} сум. Твои дела идут хорошо!",
      reportSales: "Продажи: {amount} сум.",
      reportExpenses: "Расходы: {amount} сум.",
      reportProfit: "Прибыль: {amount} сум.",
      reportDebts: "Долги клиентов: {activeCount} активных, общая сумма {amount} сум.",
      reportReminders: "Напоминания: активных {activeCount}, выполненных {doneCount}, уже отправленных уведомлений {notifiedCount}.",
      reportAll: "Сводка: продажи {sales} сум, расходы {expenses} сум, прибыль {profit} сум, активные долги {debts} сум ({debtCount}), активные напоминания {activeReminders}, отправленные уведомления {notifiedReminders}.",
      unknown: "Я не совсем понял команду. Попробуй перефразировать, например: 'Расход 10000 на бензин'."
    },
    sales: {
      title: "Продажи",
      subtitle: "История всех транзакций вашего бизнеса.",
      addBtn: "Добавить продажу",
      searchPlaceholder: "Поиск по описанию...",
      history: "История продаж",
      total: "Всего",
      date: "Дата",
      description: "Описание",
      amount: "Сумма",
      loading: "Загрузка...",
      empty: "Нет зарегистрированных продаж."
    },
    debts: {
      title: "Долговая книга",
      subtitle: "Управляйте долгами ваших клиентов в одном месте.",
      addBtn: "Записать долг",
      collectedToday: "Собрано сегодня",
      expected: "Ожидается выплат",
      overdue: "Просрочено",
      activeDebts: "Активные долги",
      client: "Клиент",
      description: "Описание",
      status: "Статус",
      amount: "Сумма",
      action: "Действие",
      active: "Активен",
      paid: "Оплачен",
      payBtn: "Оплатить",
      loading: "Загрузка данных...",
      empty: "Долгов не найдено."
    },
    clients: {
      title: "Клиенты",
      subtitle: "Ваша база постоянных покупателей.",
      addBtn: "Новый клиент",
      searchPlaceholder: "Поиск клиента по имени или номеру...",
      phone: "Телефон",
      debt: "Долг",
      viewHistory: "Посмотреть историю",
      loading: "Загрузка клиентов...",
      empty: "Клиенты не найдены."
    },
    reports: {
      title: "Аналитика",
      subtitle: "Визуальные отчеты о росте вашего бизнеса.",
      insightTitle: "AI-Инсайт недели",
      insightSubtitle: "Анализ подготовлен SavdoBot",
      insightText: "Ваши продажи в пятницу и субботу выросли на 25% по сравнению с прошлым периодом. Наиболее популярная категория — Продукты. Рекомендуем пополнить запасы к следующему уикенду.",
      salesByDay: "Продажи по дням",
      categories: "Категории доходов"
    },
    reminders: {
      title: "Запоминания",
      subtitle: "Все напоминания, которые AI сохранил из чата.",
      empty: "Пока нет напоминаний.",
      eventTime: "Время события",
      remindTime: "Напомнить в",
      status: "Статус",
      active: "Активно",
      done: "Выполнено",
      doneBtn: "Отметить выполненным",
      notified: "Уведомление отправлено",
      pending: "Ожидает уведомления"
    }
  },
  uz: {
    nav: {
      assistant: "Assistent",
      sales: "Sotuvlar",
      debts: "Qarzlar",
      clients: "Mijozlar",
      analytics: "Analitika",
      memories: "Eslatmalar",
      settings: "Sozlamalar",
      logout: "Chiqish"
    },
    dashboard: {
      welcome: "SavdoBot-ga xush kelibsiz",
      subtitle: "Biznesingiz assistent nazorati ostida.",
      aiStatus: "AI Monitoring faol",
      stats: {
        totalSales: "Umumiy Sotuv",
        expenses: "Xarajatlar",
        profit: "Sof Foyda",
        clientDebts: "Mijozlar Qarzi"
      }
    },
    chat: {
      welcome: "Salom! Men SavdoBot biznes-assistentiman. Qanday yordam bera olaman? Masalan: '50 000 so'mlik sotuv qo'sh' yoki 'Bugun qancha foyda qildim?'",
      placeholder: "Sotuvni yozing yoki foyda haqida so'rang...",
      thinking: "SavdoBot o'ylamoqda...",
      error: "Uzr, xato yuz berdi. Keyinroq qayta urinib ko'ring.",
      saleRecorded: "{amount} so'mlik sotuv yozildi. 👍",
      expenseRecorded: "Xarajat yozildi: {desc}, {amount} so'm.",
      debtAdded: "{name} uchun {amount} so'm qarz qo'shildi. Endi bu qarz daftarchasida.",
      reminderAdded: "Eslab qoldim. '{text}' uchun {time} da eslataman. 5 daqiqa oldin ogohlantiraman.",
      queryResult: "Umumiy sotuvlaringiz {amount} so'mni tashkil qiladi. Ishlaringiz juda yaxshi!",
      reportSales: "Sotuvlar: {amount} so'm.",
      reportExpenses: "Xarajatlar: {amount} so'm.",
      reportProfit: "Foyda: {amount} so'm.",
      reportDebts: "Mijozlar qarzi: {activeCount} ta faol, umumiy summa {amount} so'm.",
      reportReminders: "Eslatmalar: faol {activeCount}, bajarilgan {doneCount}, yuborilgan bildirishnomalar {notifiedCount}.",
      reportAll: "Umumiy hisobot: sotuvlar {sales} so'm, xarajatlar {expenses} so'm, foyda {profit} so'm, faol qarzlar {debts} so'm ({debtCount}), faol eslatmalar {activeReminders}, yuborilgan bildirishnomalar {notifiedReminders}.",
      unknown: "Buyruqni tushunmadim. Iltimos, boshqacha ayting, masalan: 'Benzin uchun 10000 xarajat'."
    },
    sales: {
      title: "Sotuvlar",
      subtitle: "Biznesingizdagi barcha tranzaksiyalar tarixi.",
      addBtn: "Sotuv qo'shish",
      searchPlaceholder: "Tavsif bo'yicha qidirish...",
      history: "Sotuvlar tarixi",
      total: "Jami",
      date: "Sana",
      description: "Tavsif",
      amount: "Summa",
      loading: "Yuklanmoqda...",
      empty: "Sotuvlar topilmadi."
    },
    debts: {
      title: "Qarz daftari",
      subtitle: "Mijozlaringiz qarzlarini bir joyda boshqaring.",
      addBtn: "Qarz yozish",
      collectedToday: "Bugun yig'ildi",
      expected: "Kutilayotgan to'lovlar",
      overdue: "Muddati o'tgan",
      activeDebts: "Faol qarzlar",
      client: "Mijoz",
      description: "Tavsif",
      status: "Holati",
      amount: "Summa",
      action: "Harakat",
      active: "Faol",
      paid: "To'langan",
      payBtn: "To'lash",
      loading: "Ma'lumotlar yuklanmoqda...",
      empty: "Qarzlar topilmadi."
    },
    clients: {
      title: "Mijozlar",
      subtitle: "Doimiy xaridorlaringiz bazasi.",
      addBtn: "Yangi mijoz",
      searchPlaceholder: "Mijozni ismi yoki raqami bo'yicha qidirish...",
      phone: "Telefon",
      debt: "Qarz",
      viewHistory: "Tarixni ko'rish",
      loading: "Mijozlar yuklanmoqda...",
      empty: "Mijozlar topilmadi."
    },
    reports: {
      title: "Analitika",
      subtitle: "Biznesingiz o'sishi haqida vizual hisobotlar.",
      insightTitle: "Haftalik AI-insayt",
      insightSubtitle: "Tahlil SavdoBot tomonidan tayyorlangan",
      insightText: "Juma va shanba kunlari sotuvlaringiz o'tgan davrga nisbatan 25% ga oshdi. Eng mashhur kategoriya — Oziq-ovqat. Keyingi dam olish kunlariga zaxiralarni to'ldirishni tavsiya qilamiz.",
      salesByDay: "Kunlik sotuvlar",
      categories: "Daromad kategoriyalari"
    },
    reminders: {
      title: "Eslatmalar",
      subtitle: "Chat orqali AI saqlagan barcha eslatmalar.",
      empty: "Hozircha eslatmalar yo'q.",
      eventTime: "Voqea vaqti",
      remindTime: "Eslatish vaqti",
      status: "Holat",
      active: "Faol",
      done: "Bajarildi",
      doneBtn: "Bajarildi deb belgilash",
      notified: "Bildirishnoma yuborilgan",
      pending: "Bildirishnoma kutilmoqda"
    }
  }
};

export type Language = keyof typeof translations;
