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
    flex: 1,
    backgroundColor: '#f8fafc', // Slate 50 (Very light gray)
    padding: '40pt 25pt',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  rightColumn: {
    flex: 2,
    backgroundColor: '#ffffff',
    padding: '40pt 40pt 40pt 30pt',
  },
  
  // --- Left Column Styles ---
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    objectFit: 'cover',
  },
  sectionLeft: {
    marginBottom: 18,
  },
  sectionHeadingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#047857', // Emerald 700
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  iconPlaceholder: {
    marginRight: 6,
    color: '#047857',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 8.5,
    color: '#475569',
  },
  leftItemBlock: {
    marginBottom: 10,
  },
  leftItemTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  leftItemText: {
    fontSize: 8.5,
    color: '#475569',
    lineHeight: 1.5,
  },
  bulletPointLeft: {
    width: 8,
    fontSize: 9,
    color: '#047857', // Emerald
  },

  // --- Right Column Styles ---
  headerPill: {
    backgroundColor: '#ecfdf5', // Emerald 50
    borderRadius: 16,
    padding: '16pt 20pt',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#064e3b', // Emerald 900
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#047857', // Emerald 700
  },
  
  sectionRight: {
    marginBottom: 18,
  },
  sectionHeadingRight: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#a7f3d0', // Emerald 200
    paddingBottom: 4,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.6,
  },
  itemBlock: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  roleTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
  },
  companyText: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#047857', // Emerald 700
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletPointRight: {
    width: 10,
    fontSize: 9,
    color: '#047857',
    fontFamily: 'Helvetica-Bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.5,
  },
});

export default function TechnicalClean({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;
  // Use github field as avatar url for now since it's not in the schema
  const avatarUrl = personalInfo.github && personalInfo.github.startsWith('http') ? personalInfo.github : null;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Technical Clean`}>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column (Light Sidebar) */}
        <View style={styles.leftColumn}>
          {avatarUrl && (
            <View style={styles.avatarContainer}>
              <Image src={avatarUrl} style={styles.avatar} />
            </View>
          )}

          {/* Contacts */}
          <View style={styles.sectionLeft}>
            <View style={styles.sectionHeadingLeft}>
              <Text style={styles.iconPlaceholder}>■</Text>
              <Text>Contacts</Text>
            </View>
            {personalInfo.phone && <Text style={styles.contactText}>{personalInfo.phone}</Text>}
            {personalInfo.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactText}>{personalInfo.linkedin}</Text>}
            {personalInfo.location && <Text style={styles.contactText}>{personalInfo.location}</Text>}
          </View>

          {/* Skills / Categories in Sidebar */}
          {content.skills.length > 0 && (
            <View>
              {content.skills.map((cat) => (
                <View key={cat.id} style={styles.sectionLeft}>
                  <View style={styles.sectionHeadingLeft}>
                    <Text style={styles.iconPlaceholder}>■</Text>
                    <Text>{cat.categoryName}</Text>
                  </View>
                  
                  {cat.categoryName.toLowerCase().includes('achievement') ? (
                    cat.skills.map((skill, idx) => (
                      <View key={idx} style={styles.leftItemBlock}>
                        {skill.includes(':') ? (
                          <>
                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                              <Text style={styles.bulletPointLeft}>•</Text>
                              <Text style={styles.leftItemTitle}>{skill.split(':')[0]}</Text>
                            </View>
                            <Text style={styles.leftItemText}>{skill.split(':')[1].trim()}</Text>
                          </>
                        ) : (
                          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                            <Text style={styles.bulletPointLeft}>•</Text>
                            <Text style={styles.leftItemText}>{skill}</Text>
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.leftItemText}>
                      {cat.skills.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column (Main Content) */}
        <View style={styles.rightColumn}>
          
          {/* Header Pill */}
          <View style={styles.headerPill}>
            <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
            {personalInfo.jobTitle && <Text style={styles.title}>{personalInfo.jobTitle}</Text>}
          </View>

          {content.summary && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Summary</Text>
              <Text style={styles.summaryText}>{content.summary}</Text>
            </View>
          )}

          {content.experience.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Experience</Text>
              {content.experience.map((exp) => (
                <View key={exp.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.companyText}>
                      {exp.company}
                    </Text>
                    <Text style={styles.dateText}>
                      {exp.location}
                    </Text>
                  </View>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{exp.position}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <View>
                    {exp.highlights.map((bullet, idx) => bullet ? (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletPointRight}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ) : null)}
                  </View>
                </View>
              ))}
            </View>
          )}

          {content.education.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Education</Text>
              {content.education.map((edu) => (
                <View key={edu.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                    <Text style={styles.dateText}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                  </View>
                  <Text style={[styles.companyText, { marginBottom: 0, color: '#334155' }]}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
}
