import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeContent } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  leftColumn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: '30pt 18pt',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  rightColumn: {
    flex: 2,
    backgroundColor: '#ffffff',
    padding: '30pt 25pt',
  },
  
  // --- Left Column Styles ---
  sectionLeft: {
    marginBottom: 12,
  },
  sectionHeadingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#047857', // Emerald 700
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  iconPlaceholder: {
    marginRight: 4,
    color: '#047857',
  },
  contactItem: {
    marginBottom: 3,
  },
  contactText: {
    fontSize: 8,
    color: '#475569',
  },
  leftItemBlock: {
    marginBottom: 6,
  },
  leftItemTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 1,
  },
  leftItemText: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.35,
  },

  // --- Right Column Styles ---
  headerPill: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: '10pt 14pt',
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#064e3b',
    marginBottom: 2,
  },
  title: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
  },
  
  sectionRight: {
    marginBottom: 12,
  },
  sectionHeadingRight: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#a7f3d0',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  roleTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
  },
  companyText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletPointRight: {
    width: 8,
    fontSize: 8.5,
    color: '#047857',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.35,
  },
});

export default function TechnicalClean({ content }: { content: ResumeContent }) {
  const { personalInfo } = content;

  return (
    <Document title={`${personalInfo.fullName || 'Resume'} - Technical Clean`}>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column (Light Sidebar) */}
        <View style={styles.leftColumn}>
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
          {content.skills && content.skills.length > 0 && (
            <View>
              {content.skills.map((cat) => (
                <View key={cat.id} style={styles.sectionLeft}>
                  <View style={styles.sectionHeadingLeft}>
                    <Text style={styles.iconPlaceholder}>■</Text>
                    <Text>{cat.categoryName}</Text>
                  </View>
                  <Text style={styles.leftItemText}>{cat.skills.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {content.certifications && content.certifications.length > 0 && (
            <View style={styles.sectionLeft}>
              <View style={styles.sectionHeadingLeft}>
                <Text style={styles.iconPlaceholder}>■</Text>
                <Text>Certifications</Text>
              </View>
              {content.certifications.map((cert) => (
                <View key={cert.id} style={styles.leftItemBlock}>
                  <Text style={styles.leftItemTitle}>{cert.issuer}: {cert.name}</Text>
                  {cert.credentialId && <Text style={styles.leftItemText}>{cert.credentialId}</Text>}
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

          {content.experience && content.experience.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Experience</Text>
              {content.experience.map((exp) => (
                <View key={exp.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.companyText}>{exp.company}</Text>
                    <Text style={styles.dateText}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.roleTitle}>{exp.position}</Text>
                  <View style={{ marginTop: 2 }}>
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

          {content.projects && content.projects.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Projects</Text>
              {content.projects.map((proj) => (
                <View key={proj.id} style={styles.itemBlock}>
                  <Text style={styles.roleTitle}>{proj.name}</Text>
                  {proj.technologies && (
                    <Text style={[styles.companyText, { fontSize: 8, marginBottom: 1 }]}>{proj.technologies.join(', ')}</Text>
                  )}
                  {proj.description && <Text style={styles.summaryText}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {content.education && content.education.length > 0 && (
            <View style={styles.sectionRight}>
              <Text style={styles.sectionHeadingRight}>Education</Text>
              {content.education.map((edu) => (
                <View key={edu.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.roleTitle}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                    <Text style={styles.dateText}>
                      {edu.startDate} – {edu.endDate}
                    </Text>
                  </View>
                  <Text style={[styles.companyText, { marginBottom: 0, color: '#334155' }]}>{edu.institution}</Text>
                  {edu.gpa && <Text style={[styles.summaryText, { fontSize: 8 }]}>{edu.gpa}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
}

