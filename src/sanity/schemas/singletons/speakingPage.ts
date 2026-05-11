import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'speakingPage',
  title: 'Speaking Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Label',
      type: 'string',
      initialValue: 'Public Speaking',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Public Speaking'
    }),
    defineField({
      name: 'entries',
      title: 'Engagements',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'speakingEntry',
          fields: [
            defineField({ name: 'year', title: 'Year', type: 'string' }),
            defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'eventTitle', title: 'Title', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
            defineField({ name: 'venue', title: 'Venue', type: 'string' })
          ],
          preview: {
            select: { title: 'eventTitle', subtitle: 'role', year: 'year' },
            prepare: ({ title, subtitle, year }) => ({
              title: typeof title === 'string' ? title : 'Engagement',
              subtitle: [year, subtitle].filter(Boolean).join(' · ')
            })
          }
        })
      ]
    })
  ],
  preview: {
    prepare: () => ({ title: 'Speaking Page' })
  }
});
