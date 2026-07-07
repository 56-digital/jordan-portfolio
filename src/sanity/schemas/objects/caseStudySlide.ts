import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'caseStudySlide',
  title: 'Case Study Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string'
    }),
    defineField({
      name: 'text',
      title: 'Body Text',
      type: 'text',
      rows: 8
    }),
    defineField({
      name: 'mediaPath',
      title: 'Media Path',
      description: 'Fallback only. Relative path in /public (for example media/example.jpg).',
      type: 'string'
    }),
    defineField({
      name: 'mediaFile',
      title: 'Uploaded Media',
      description: 'Primary source. Upload image/video here.',
      type: 'file',
      options: {
        accept: 'image/*,video/*'
      }
    }),
    defineField({
      name: 'showVideoControls',
      title: 'Show Video Controls',
      description: 'Only applies when the media above is a video. When off, the video autoplays muted on loop with just a mute toggle. When on, it shows the native play/pause/volume/seek controls and does not autoplay.',
      type: 'boolean',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mediaPath'
    },
    prepare(selection) {
      return {
        title: selection.title || 'Untitled slide',
        subtitle: selection.subtitle || 'No media path'
      };
    }
  }
});
