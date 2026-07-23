import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 10,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  titre: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  sousTitre: {
    fontSize: 9,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 2,
  },
  filet: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginVertical: 12,
  },
  h2: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 14,
    marginBottom: 6,
  },
  h3: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  paragraphe: {
    marginBottom: 6,
  },
  gras: {
    fontFamily: 'Helvetica-Bold',
  },
  italique: {
    fontFamily: 'Helvetica-Oblique',
  },
  petit: {
    fontSize: 8,
    color: '#6b7280',
  },
  liste: {
    marginLeft: 10,
    marginBottom: 6,
  },
  ligneListe: {
    marginBottom: 2,
  },
  encadre: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  table: {
    marginBottom: 8,
  },
  ligneEnTete: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  ligne: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  celluleEnTete: {
    padding: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  cellule: {
    padding: 4,
    fontSize: 9,
  },
  signatures: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blocSignature: {
    width: '45%',
  },
  piedDePage: {
    position: 'absolute',
    bottom: 20,
    left: 48,
    right: 48,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
})
