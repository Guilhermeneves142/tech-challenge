import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Calendar } from './calendar'
import type { DateRange } from 'react-day-picker'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    captionLayout: {
      control: 'radio',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
    },
    buttonVariant: {
      control: 'radio',
      options: ['ghost', 'outline', 'default'],
    },
    showOutsideDays: { control: 'boolean' },
    showWeekNumber: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    captionLayout: 'label',
    showOutsideDays: true,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
  },
}

export const WithDropdown: Story = {
  args: {
    captionLayout: 'dropdown',
    showOutsideDays: true,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        fromYear={2000}
        toYear={2030}
      />
    )
  },
}

export const RangeSelection: Story = {
  render: (args) => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <Calendar
        {...args}
        mode="range"
        selected={range}
        onSelect={setRange}
        showOutsideDays
      />
    )
  },
}

export const WithWeekNumbers: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        showWeekNumber
        showOutsideDays
      />
    )
  },
}

export const MultipleMonths: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        showOutsideDays
      />
    )
  },
}

export const WithDisabledDates: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ dayOfWeek: [0, 6] }} 
        showOutsideDays
      />
    )
  },
}