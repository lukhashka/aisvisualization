import type { ComponentType } from 'react';

/** Одна лабораторна робота / інтерактивна задача. */
export interface TaskModule {
  /** Унікальний id, використовується в URL: #/<id> */
  id: string;
  /** Назва в меню та в заголовку сторінки */
  title: string;
  /** Короткий опис під назвою */
  subtitle?: string;
  /** Емодзі-іконка в меню */
  icon?: string;
  /** Сам інтерактив */
  Component: ComponentType;
}

/** Тема (розділ курсу), яка групує кілька задач. */
export interface Topic {
  id: string;
  title: string;
  tasks: TaskModule[];
}
