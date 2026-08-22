import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  leftColumn: {
    flex: 2,
    backgroundColor: '#ffffff',
    padding: '40pt 30pt 40pt 40pt',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#1e293b', // Slate 800 (Dark Navy)
    padding: '40pt 25pt',
    color: '#f1f5f9', // Slate 100
  },
  // --- Left Column Styles ---
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb', // Blue 600
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8,
    color: '#64748b',
    marginBottom: 20,
  },
  sectionLeft: {
    marginBottom: 16,
  },
  sectionHeadingLeft: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.6,
  },
  itemBlock: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  roleTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  companyText: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb', // Blue 600
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 9,
    color: '#64748b',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.5,
  },
  // --- Right Column Styles ---
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    objectFit: 'cover',
  },
  sectionRight: {
    marginBottom: 18,
  },
  sectionHeadingRight: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    paddingBottom: 4,
    marginBottom: 10,
  },
  rightItemBlock: {
    marginBottom: 10,
  },
  rightItemTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  rightItemText: {
    fontSize: 8.5,
    color: '#cbd5e1',
    lineHeight: 1.5,
  }
});

export default function ModernExecutive({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;
  // Use github field as avatar url for now since it's not in the schema
  const avatarUrl = personalInfo.github && personalInfo.github.startsWith('http') ? personalInfo.github : null;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Modern Executive`}>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>•  {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•  {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>•  {personalInfo.linkedin}</Text>}
          </View>

          {content.summary && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Summary</Text>
              <Text style={styles.summaryText}>{content.summary}</Text>
            </View>
          )}

          {content.experience.length > 0 && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Experience</Text>
              {content.experience.map((exp) => (
                <View key={exp.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{exp.position}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.companyText}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                  <View>
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

          {content.education.length > 0 && (
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionHeadingLeft}>Education</Text>
              {content.education.map((edu) => (
                <View key={edu.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                    <Text style={styles.dateText}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                  </View>
                  <Text style={[styles.companyText, { marginBottom: 0 }]}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column (Dark Sidebar) */}
        <View style={styles.rightColumn}>
          {avatarUrl && (
            <View style={styles.avatarContainer}>
              <Image src={avatarUrl} style={styles.avatar} />
            </View>
          )}

          {content.skills.length > 0 && (
            <View>
              {content.skills.map((cat) => (
                <View key={cat.id} style={styles.sectionRight}>
                  <Text style={styles.sectionHeadingRight}>{cat.categoryName}</Text>
                  
                  {/* If it's key achievements, we render them as separated blocks, else as a joined string */}
                  {cat.categoryName.toLowerCase().includes('achievement') ? (
                    cat.skills.map((skill, idx) => (
                      <View key={idx} style={styles.rightItemBlock}>
                        {/* We try to split title and description if it contains a colon, else just render it */}
                        {skill.includes(':') ? (
                          <>
                            <Text style={styles.rightItemTitle}>{skill.split(':')[0]}</Text>
                            <Text style={styles.rightItemText}>{skill.split(':')[1].trim()}</Text>
                          </>
                        ) : (
                          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                            <Text style={{ width: 8, fontSize: 10, color: '#2563eb' }}>›</Text>
                            <Text style={styles.rightItemText}>{skill}</Text>
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.rightItemText}>
                      {cat.skills.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
}
