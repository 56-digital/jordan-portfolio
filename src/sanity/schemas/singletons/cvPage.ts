import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'cvPage',
  title: 'CV Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Label',
      type: 'string',
      initialValue: 'CV',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Jordan Sowunmi'
    }),
    defineField({
      name: 'bio',
      title: 'Bio paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 3 })]
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cvJob',
          title: 'Role',
          fields: [
            defineField({ name: 'company', title: 'Company', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'dates', title: 'Dates', type: 'string' }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [defineArrayMember({ type: 'text', rows: 2 })]
            })
          ],
          preview: {
            select: { title: 'company', subtitle: 'role' }
          }
        })
      ]
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cvEducation',
          fields: [
            defineField({ name: 'school', title: 'School', type: 'string' }),
            defineField({ name: 'detail', title: 'Detail', type: 'string' })
          ],
          preview: { select: { title: 'school', subtitle: 'detail' } }
        })
      ]
    })
  ],
  preview: {
    prepare: () => ({ title: 'CV Page' })
  }
});
