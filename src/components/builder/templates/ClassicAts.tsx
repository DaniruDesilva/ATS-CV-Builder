import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.35,
    color: '#111827',
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8.5,
    color: '#4b5563',
  },
  section: {
    marginTop: 8,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: '#374151',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
    color: '#111827',
  },
  summaryText: {
    fontSize: 9.5,
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  itemSub: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#374151',
  },
  itemDates: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#4b5563',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#1f2937',
  },
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillCatName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    width: 130,
    color: '#111827',
  },
  skillListText: {
    flex: 1,
    fontSize: 9,
    color: '#1f2937',
  },
});

export function ClassicAtsTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - ATS Classic`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>•  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•  {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>•  {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text>•  {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>WORK EXPERIENCE</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position || 'Position'}</Text>
                  <Text style={styles.itemDates}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                  <Text style={styles.itemSub}>{exp.company}</Text>
                  {exp.location && <Text style={styles.itemDates}>{exp.location}</Text>}
                </View>

                {exp.highlights.map((h, i) => (
                  h ? (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ) : null
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>TECHNICAL SKILLS</Text>
            {skills.map((cat) => (
              <View key={cat.id} style={styles.skillCategoryRow}>
                <Text style={styles.skillCatName}>{cat.categoryName}:</Text>
                <Text style={styles.skillListText}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>EDUCATION</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                  <Text style={styles.itemDates}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.itemSub}>{edu.institution}</Text>
                  {edu.gpa && <Text style={styles.itemDates}>GPA: {edu.gpa}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>KEY PROJECTS</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 4 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.url && <Text style={styles.itemDates}>{proj.url}</Text>}
                </View>
                {proj.description && <Text style={styles.summaryText}>{proj.description}</Text>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={{ fontSize: 8.5, color: '#4b5563', marginTop: 1 }}>
                    Technologies: {proj.technologies.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
