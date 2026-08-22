import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: '36pt 40pt',
    fontSize: 10,
    fontFamily: 'Times-Roman', // Using Times-Roman as default for traditional LaTeX look
    lineHeight: 1.3,
    color: '#000000',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    fontSize: 9.5,
  },

  // Section
  section: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 6,
  },

  // Items
  itemBlock: {
    marginBottom: 8,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  itemTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
  },
  itemSubtitle: {
    fontFamily: 'Times-Italic',
    fontSize: 10,
  },
  itemDate: {
    fontSize: 10,
  },
  itemLocation: {
    fontSize: 10,
  },
  
  // Bullet points
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },

  // Skills
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  skillCategory: {
    fontFamily: 'Times-Bold',
    marginRight: 4,
  },
  skillList: {
    flex: 1,
  },
});

export default function TraditionalAtsTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Traditional ATS`}>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {personalInfo.phone && (personalInfo.email || personalInfo.linkedin) && <Text>|</Text>}
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.email && personalInfo.linkedin && <Text>|</Text>}
            {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
            {personalInfo.linkedin && personalInfo.github && <Text>|</Text>}
            {personalInfo.github && <Text>{personalInfo.github}</Text>}
          </View>
        </View>

        {/* Education (Often first in traditional resumes) */}
        {content.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Education</Text>
            {content.education.map((edu) => (
              <View key={edu.id} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{edu.institution}</Text>
                  <Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemSubtitle}>
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </Text>
                  {edu.gpa && <Text style={styles.itemSubtitle}>GPA: {edu.gpa}</Text>}
                </View>
                {edu.highlights && edu.highlights.length > 0 && (
                  <View style={{ marginTop: 2 }}>
                    {edu.highlights.map((h, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Experience</Text>
            {content.experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  {exp.location && <Text style={styles.itemLocation}>{exp.location}</Text>}
                </View>
                <View style={{ marginTop: 3 }}>
                  {exp.highlights.map((bullet, idx) => bullet ? (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ) : null)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {content.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Projects</Text>
            {content.projects.map((proj) => (
              <View key={proj.id} style={styles.itemBlock}>
                <View style={styles.itemHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.itemTitle}>{proj.name}</Text>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <Text style={styles.itemSubtitle}> | {proj.technologies.join(', ')}</Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 2 }}>
                  {proj.description && (
                     <View style={styles.bulletRow}>
                       <Text style={styles.bulletPoint}>•</Text>
                       <Text style={styles.bulletText}>{proj.description}</Text>
                     </View>
                  )}
                  {proj.highlights && proj.highlights.map((bullet, idx) => bullet ? (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ) : null)}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Technical Skills</Text>
            {content.skills.map((cat) => (
              <View key={cat.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{cat.categoryName}:</Text>
                <Text style={styles.skillList}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
