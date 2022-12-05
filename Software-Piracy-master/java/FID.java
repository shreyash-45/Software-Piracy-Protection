import java.io.*;
import java.security.*;
import java.nio.charset.*;

public class FID{  
    private static String bytesToHex(byte[] hash) throws Exception{
        StringBuilder hexString = new StringBuilder(100);
        String hex = "";
        int i;
        for (i = 0; i < hash.length; i++) {
            hex = Integer.toHexString(0xff & hash[i]);
            if(hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    public static String getFileHash(String[] files) throws Throwable{
        String FID = "";
        for (String s : files){
            File file = new File(s);
            BufferedReader br = new BufferedReader(new FileReader(file));
            String st, f = "";
            while ((st = br.readLine()) != null){
                f = f+st;
            }
            br.close();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(f.getBytes(StandardCharsets.UTF_8));
            FID = FID + bytesToHex(hash);
        }
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(FID.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }
    public static void main(String args[]) throws Throwable{
        String FID;
        FID = getFileHash(args);
        System.out.println(FID);
    }
}